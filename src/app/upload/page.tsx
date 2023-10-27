'use client';

import React from 'react';
import { Select } from 'antd';
import useRective from '@/hooks/useRective';

import BigFileUpload from './BigFileUpload';
import ImageCompress from './ImageCompress';

import styles from './index.module.scss';

const App = () => {
  const rective = useRective({ current: 'big' });

  return (
    <div className={styles.upload_page}>
      <Select
        defaultValue='big'
        style={{ width: 320 }}
        onChange={(value: string) => {
          rective.current = value;
        }}
        options={[
          { value: 'compress', label: '图片压缩' },
          { value: 'big', label: '大文件上传' },
        ]}
      />
      {rective.current === 'big' && <BigFileUpload />}
      {rective.current === 'compress' && <ImageCompress />}
    </div>
  );
};

export default App;
