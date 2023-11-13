'use client';

import React from 'react';
import { Select } from 'antd';
import Interceptor from './Interceptor';
import Drag from './Drag';
import CustomRedux from './CustomRedux';
import RequestdleCallback from './RequestdleCallback';
import MathPosition from './PositionByMath';
import useRective from '@/hooks/useRective';

import style from './index.module.scss';

const Js = () => {
  const rective = useRective({ current: 'MathPosition' });

  return (
    <div className={style.jsContainer}>
      <div className={style.selectWrapper}>
        <Select
          defaultValue='MathPosition'
          style={{ width: 320 }}
          onChange={(value: string) => {
            rective.current = value;
          }}
          options={[
            { value: 'drag', label: '拖拽排序' },
            { value: 'interceptor', label: '洋葱模型' },
            { value: 'redux', label: 'redux' },
            {
              value: 'requestIdleCallback',
              label: 'requestIdleCallback任务分段',
            },
            {
              value: 'MathPosition',
              label: 'css变量轨迹',
            },
          ]}
        />
      </div>

      {rective.current === 'interceptor' && <Interceptor />}
      {rective.current === 'drag' && <Drag />}
      {rective.current === 'redux' && <CustomRedux />}
      {rective.current === 'requestIdleCallback' && <RequestdleCallback />}
      {rective.current === 'MathPosition' && <MathPosition />}
    </div>
  );
};

export default Js;
