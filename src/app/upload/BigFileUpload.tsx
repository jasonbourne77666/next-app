import { FC, CSSProperties, useReducer, useState } from 'react';
import { Upload, Button, message, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import SparkMD5 from 'spark-md5';
import axios from 'axios';
import cls from 'classnames';

const { Dragger } = Upload;
const baseUrl = 'http://localhost:3000';
const initialState = { checkPercent: 0, uploadPercent: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'check':
      initialState.checkPercent = action.checkPercent;
      return { ...initialState };
    case 'upload':
      initialState.uploadPercent = action.uploadPercent;
      return { ...initialState };
    case 'init':
      initialState.checkPercent = 0;
      initialState.uploadPercent = 0;
      return { ...initialState };
    default:
      return {
        checkPercent: state.checkPercent,
        uploadPercent: state.uploadPercent,
      };
  }
}
const chunks = 100; // 切成100份
let chunkSize = 5 * 1024 * 1024; // 5M 默认切片大小
let checkCurrentChunk = 0; // 检查，当前切片
let uploadCurrentChunk = 0; // 上传，当前切片

interface IAppProps {
  className?: string;
  style?: CSSProperties;
}

const useBigFileUpload: FC<IAppProps> = ({ className = '', style = {} }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [file, setFile] = useState<RcFile | null>(null);

  /**
   * 将文件转换成md5并进行切片
   * @returns md5
   */
  const md5File = (file): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 重制切片大小
      chunkSize = file?.size / 100;

      // 文件截取
      const blobSlice =
          File.prototype.slice ||
          (File.prototype as any).mozSlice ||
          (File.prototype as any).webkitSlice,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

      fileReader.onload = function (e) {
        if (e?.target?.result) {
          // console.log('read chunk nr', checkCurrentChunk + 1, 'of', chunks);
          spark.append(e?.target?.result as ArrayBuffer);
          checkCurrentChunk += 1;

          if (checkCurrentChunk < chunks) {
            loadNext();
          } else {
            const result = spark.end();
            resolve(result);
          }
        }
      };

      fileReader.onerror = function () {
        message.error('文件读取错误');
      };

      const loadNext = () => {
        const start = checkCurrentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        // 文件切片
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        // 检查进度条
        dispatch({ type: 'check', checkPercent: checkCurrentChunk + 1 });
      };

      loadNext();
    });
  };

  /**
   * 校验文件
   * @param {*} fileName 文件名
   * @param {*} fileMd5Value md5文件
   * @returns
   */
  const checkFileMD5 = (fileName: string, fileMd5Value: string) => {
    const url = `${baseUrl}/api/upload/check/file`;
    return axios.get(url, {
      params: {
        fileName,
        fileMd5Value,
      },
    });
  };

  // 上传chunk
  async function upload({ i, file, fileMd5Value, chunks }) {
    uploadCurrentChunk = 0;
    //构造一个表单，FormData是HTML5新增的
    const end =
      (i + 1) * chunkSize >= file.size ? file.size : (i + 1) * chunkSize;
    const form = new FormData();
    form.append('data', file.slice(i * chunkSize, end)); // file对象的slice方法用于切出文件的一部分
    form.append('total', chunks); //总片数
    form.append('index', i); //当前是第几片
    form.append('fileMd5Value', fileMd5Value);
    const { data } = await axios({
      method: 'post',
      url: `${baseUrl}/api/upload/fileSlice`,
      data: form,
    });

    if (data.stat) {
      uploadCurrentChunk = uploadCurrentChunk + 1;
      const uploadPercent = Math.ceil((uploadCurrentChunk / chunks) * 100);
      dispatch({ type: 'upload', uploadPercent });
    }
  }

  /**
   * 上传chunk
   * @param {*} fileMd5Value
   * @param {*} chunkList
   */
  async function checkAndUploadChunk(
    file: File,
    fileMd5Value: string,
    chunkList: string[],
  ) {
    const chunks = Math.ceil(file.size / chunkSize);
    const requestList: any[] = [];

    for (let i = 0; i < chunks; i++) {
      const exit = chunkList.indexOf(i + '') > -1;
      // 如果不存在，则上传
      if (!exit) {
        requestList.push(upload({ i, file, fileMd5Value, chunks }));
      }
    }

    // 并发上传
    if (requestList?.length) {
      await Promise.all(requestList);
    }
  }

  /**
   * 所有的分片上传完成，准备合成
   * @param {*} file
   * @param {*} fileMd5Value
   */
  function notifyServer(file: File, fileMd5Value: string) {
    const url = `${baseUrl}/api/upload/merge`;
    axios
      .get(url, {
        params: {
          md5: fileMd5Value,
          fileName: file.name,
          size: file.size,
        },
      })
      .then(({ data }) => {
        if (data.data.stat) {
          message.success('上传成功');
        } else {
          message.error('上传失败');
        }
      });
  }

  // 触发上传
  const start = async () => {
    if (!file) {
      message.warning('上传文件先');
      return;
    }
    // 1.校验文件，返回md5
    const fileMd5Value = await md5File(file);
    // 2.校验文件的md5
    const res = await checkFileMD5(file.name, fileMd5Value);
    const data = res.data?.data ?? {};
    // 如果文件已存在, 就秒传
    if (data?.file) {
      message.success('文件已秒传');
      return;
    }
    // 3：检查并上传切片
    await checkAndUploadChunk(file, fileMd5Value, data.chunkList);

    // 4：通知服务器所有服务器分片已经上传完成
    notifyServer(file, fileMd5Value);
  };

  const props: UploadProps = {
    multiple: false,
    beforeUpload(file) {
      console.log(file);
      setFile(file);
      return false;
    },
  };

  return (
    <div
      className={cls(className)}
      style={{ margin: '20px auto', width: 500, ...style }}>
      <Dragger {...props}>
        <p className={cls('ant-upload-drag-icon')}>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>点击或拖拽文件到这个区域来上传</p>
      </Dragger>
      <Button onClick={start}>上传</Button>
    </div>
  );
};

export default useBigFileUpload;
