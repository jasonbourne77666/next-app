import { ComponentStory, ComponentMeta } from '@storybook/react';
import Interceptor, { IInterceptor } from './Interceptor';
import { mockInterceptorProps } from './Interceptor.mocks';

export default {
  title: 'javascript/Interceptor',
  component: Interceptor,
  argTypes: {},
} as ComponentMeta<typeof Interceptor>;

const Template: ComponentStory<typeof Interceptor> = (args) => (
  <Interceptor {...args} />
);

export const Base = Template.bind({});

Base.args = {
  ...mockInterceptorProps.base,
} as IInterceptor;
