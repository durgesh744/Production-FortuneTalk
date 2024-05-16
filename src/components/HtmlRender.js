import {View, Text} from 'react-native';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import {SCREEN_WIDTH} from '../config/Screen';
import { Colors } from '../assets/style';

const HtmlRender = ({data = '', width = SCREEN_WIDTH,}) => {
  const html = {
    html: data,
  };
  return (
    <RenderHTML
      contentWidth={width}
      source={html}
      enableExperimentalMarginCollapsing={false}
      baseStyle={{
        color: Colors.blackLight,
        textAlign: 'justify',
        fontSize: '12px',
        lineHeight: 16,
      }}
    />
  );
};

export default HtmlRender;
