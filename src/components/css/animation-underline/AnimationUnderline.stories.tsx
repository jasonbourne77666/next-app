import { ComponentStory, ComponentMeta } from '@storybook/react';
import AnimationUnderline, { IAnimationUnderline } from './AnimationUnderline';
import { mockAnimationUnderlineProps } from './AnimationUnderline.mocks';

export default {
  title: 'css/AnimationUnderline',
  component: AnimationUnderline,
  argTypes: {},
} as ComponentMeta<typeof AnimationUnderline>;

const Template: ComponentStory<typeof AnimationUnderline> = (args) => (
  <AnimationUnderline {...args} />
);

export const Base = Template.bind({});

Base.args = {
  ...mockAnimationUnderlineProps.base,
} as IAnimationUnderline;
