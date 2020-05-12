/*
 * @Author: rockyWu
 * @Date: 2020-05-11 18:12:32
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-11 18:27:23
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from 'antd';

export default {
  title: 'Button',
  component: Button,
};

export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

export const Emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

export const Emoji1 = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
