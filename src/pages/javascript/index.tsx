import React from 'react';
import { NextPageWithLayout } from '../page';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import SidebarLayout from '@/components/layouts/sidebar/SidebarLayout';
import Interceptor from '@/components/javascript/interceptor/Interceptor';

const Interceptors: NextPageWithLayout = () => {
  return (
    <div>
      <ul>
        <li>
          <p>Interceptor</p>
          <Interceptor />
        </li>
      </ul>
    </div>
  );
};

export default Interceptors;
Interceptors.getLayout = (page) => {
  return (
    <PrimaryLayout>
      <SidebarLayout />
      {page}
    </PrimaryLayout>
  );
};
