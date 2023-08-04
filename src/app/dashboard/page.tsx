'use client'; // 如果是在 Pages Router 中使用，则不需要加这行

import React from 'react';
import { Button } from 'antd';

export default function Page() {
  return (
    <div>
      <h1>Hello, Dashboard Page!</h1>
      <Button type='primary'>Button</Button>
    </div>
  );
}
