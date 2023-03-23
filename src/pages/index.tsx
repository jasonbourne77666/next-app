import AnimationUnderline from '../components/css/animation-underline/AnimationUnderline';
import { mockAnimationUnderlineProps } from '../components/css/animation-underline/AnimationUnderline.mocks';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import SidebarLayout from '../components/layouts/sidebar/SidebarLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  return (
    <section>
      <h1>Welcome !</h1>
      <AnimationUnderline {...mockAnimationUnderlineProps.base} />
    </section>
  );
};
export default Home;

Home.getLayout = (page) => {
  return (
    <PrimaryLayout>
      <SidebarLayout />
      {page}
    </PrimaryLayout>
  );
};
