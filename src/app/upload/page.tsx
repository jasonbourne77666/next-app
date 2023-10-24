'use client';

import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Form, Input, Button, Space } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import cls from 'classnames';
import SparkMD5 from 'spark-md5';

import styles from './index.module.scss';

const { Dragger } = Upload;

const App = () => {
  const [form] = Form.useForm();
  const [filePath, setFilePath] = useState<Array<Record<string, string>>>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const downlaod = async (file: File, name: string, type: string) => {
    const blob = new Blob([file], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();

    message.success('压缩成功');
  };

  const getImage = (values) => {
    return axios.get('http://localhost:3000/api/upload/compression', {
      params: {
        color: values.color || 256,
        level: values.level || 9,
        path: values.filePath,
        originalname: values.originalname,
      },
      responseType: 'arraybuffer',
    });
  };

  const compress = async (values) => {
    const reqList: Array<Promise<any>> = [];

    filePath.forEach((item) => {
      reqList.push(
        getImage({
          ...values,
          filePath: item.path,
          originalname: item.originalname,
        }),
      );
    });

    const data = await Promise.all(reqList);
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].data;
        downlaod(element, filePath[i]?.name, filePath[i]?.mimetype);
      }
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    setUploading(true);
    // You can use any AJAX library you like
    axios
      .post('http://localhost:3000/api/upload', formData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setFileList([]);
          setFilePath(res.data.data);
          message.success('upload successfully.');
        } else {
          message.error('upload failed.');
        }
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    // name: 'file',
    // action: 'http://localhost:3000/api/upload',
    // onChange(info) {
    //   const { status } = info.file;
    //   if (status === 'done') {
    //     setFilePath(info.file.response.data);
    //     setFileName(info.file.name);
    //     message.success(`${info.file.name} 文件上传成功`);
    //   } else if (status === 'error') {
    //     message.error(`${info.file.name} 文件上传失败`);
    //   }
    // },
    multiple: true,
    // directory: true, // 选择文件夹
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((v) => [...v, file]);
      return false;
    },
    fileList,
  };

  const md5File = (file: File) => {
    return new Promise((resolve, reject) => {
      // 文件截取
      const blobSlice =
        File.prototype.slice ||
        (File.prototype as any).mozSlice ||
        (File.prototype as any).webkitSlice;

      const chunkSize = file?.size / 100;
      const chunks = 100;
      let currentChunk = 0;
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();

      fileReader.onload = function (e) {
        if (e.target) {
          console.log('read chunk nr', currentChunk + 1, 'of', chunks);
          spark.append(e.target.result as ArrayBuffer); // Append array buffer
          currentChunk += 1;

          if (currentChunk < chunks) {
            loadNext();
          } else {
            const result = spark.end(); // Compute hash
            resolve(result);
          }
        }
      };

      fileReader.onerror = function () {
        message.error('文件读取错误');
      };

      const loadNext = () => {
        const start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        // 文件切片
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        // 检查进度条
        // dispatch({ type: 'check', checkPercent: currentChunk + 1 });
      };

      // 触发文件切片
      loadNext();
    });
  };

  // 大文件上传
  const handleBigFileUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    setUploading(true);
    // You can use any AJAX library you like
    fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className={styles.upload_page}>
      <Form
        style={{ width: 500, margin: '50px auto' }}
        form={form}
        onFinish={compress}>
        <Form.Item label='颜色数量' name='color'>
          <Input />
        </Form.Item>
        <Form.Item label='压缩级别' name='level'>
          <Input />
        </Form.Item>

        <Form.Item>
          <Dragger {...props}>
            <p className={cls('ant-upload-drag-icon', styles.drag_icon)}>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>点击或拖拽文件到这个区域来上传</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button.Group>
            <>
              <Space>
                <Button
                  loading={uploading}
                  onClick={handleUpload}
                  type={'primary'}>
                  大文件上传
                </Button>
                <Button
                  loading={uploading}
                  onClick={handleUpload}
                  type={'primary'}>
                  上传
                </Button>
                <Button loading={uploading} type='primary' htmlType='submit'>
                  压缩
                </Button>
              </Space>
            </>
          </Button.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
