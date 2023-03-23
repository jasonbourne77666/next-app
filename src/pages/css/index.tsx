import React from 'react';
import { NextPageWithLayout } from '../page';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import SidebarLayout from '@/components/layouts/sidebar/SidebarLayout';
import AnimationUnderline from '@/components/css/animation-underline/AnimationUnderline';
import { mockAnimationUnderlineProps } from '@/components/css/animation-underline/AnimationUnderline.mocks';

type Props = {};

const DisplayCss: NextPageWithLayout = (props: Props) => {
  return (
    <div>
      <ul>
        <li>
          <p></p>
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
