import { ComponentStory, ComponentMeta } from '@storybook/react';
import Progress, { IProgress } from './Progress';
import { mockProgressProps } from './Progress.mocks';

export default {
  title: 'svg/Progress',
  component: Progress,
  argTypes: {},
} as ComponentMeta<typeof Progress>;

const Template: ComponentStory<typeof Progress> = (args) => (
  <Progress {...args} />
);

export const Base = Template.bind({});

Base.args = {
  ...mockProgressProps.base,
} as IProgress;
