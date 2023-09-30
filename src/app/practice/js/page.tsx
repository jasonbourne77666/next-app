'use client';

import React from 'react';
import { Select } from 'antd';
import Interceptor from './Interceptor';
import Drag from './Drag';
import useRective from '@/hooks/useRective';

import style from './index.module.scss';

const Js = () => {
  const rective = useRective({ current: 'interceptor' });

  return (
    <div className={style.jsContainer}>
      <div className={style.selectWrapper}>
        <Select
          defaultValue='洋葱模型'
          style={{ width: 120 }}
          onChange={(value: string) => {
            rective.current = value;
          }}
          options={[
            { value: 'interceptor', label: '洋葱模型' },
            { value: 'drag', label: '拖拽排序' },
          ]}
        />
      </div>

      {rective.current === 'interceptor' && <Interceptor />}
      {rective.current === 'drag' && <Drag />}
    </div>
  );
};

export default Js;
