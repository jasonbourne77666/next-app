import React from 'react';
import { NextPageWithLayout } from '../page';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import SidebarLayout from '@/components/layouts/sidebar/SidebarLayout';
import Progress from '@/components/svg/progress/Progress';
import { mockProgressProps } from '@/components/svg/progress/Progress.mocks';

const DisplaySvg: NextPageWithLayout = () => {
  return (
    <div>
      <ul>
        <li>
          <p>svg</p>
          <Progress {...mockProgressProps.base} />
        </li>
      </ul>
    </div>
  );
};

DisplaySvg.getLayout = (page) => {
  return (
    <PrimaryLayout>
      <SidebarLayout />
      {page}
    </PrimaryLayout>
  );
};

export default DisplaySvg;
