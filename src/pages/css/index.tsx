import React from 'react';
import { NextPageWithLayout } from '../page';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import SidebarLayout from '@/components/layouts/sidebar/SidebarLayout';
import AnimationUnderline from '@/components/css/animation-underline/AnimationUnderline';
import { mockAnimationUnderlineProps } from '@/components/css/animation-underline/AnimationUnderline.mocks';

const DisplayCss: NextPageWithLayout = () => {
  return (
    <div>
      <ul>
        <li>
          <p>背景色渐变</p>
          <AnimationUnderline {...mockAnimationUnderlineProps.base} />
        </li>
      </ul>
    </div>
  );
};

DisplayCss.getLayout = (page) => {
  return (
    <PrimaryLayout>
      <SidebarLayout />
      {page}
    </PrimaryLayout>
  );
};

export default DisplayCss;
