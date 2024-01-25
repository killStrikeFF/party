declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

import '@rneui/themed';

declare module '@rneui/themed' {
  export interface ButtonProps {
    isIconButton?: boolean;
  }
}
