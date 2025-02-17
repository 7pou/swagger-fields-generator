import React from 'react'
import Flex, { type FlexProps } from "~components/Flex"
import { isValid } from '~utils';

interface SpaceProps extends FlexProps{
    gap?: number;
    children?: React.ReactNode;
}
const Space: React.FC<SpaceProps> = (props) => {
    const count = React.Children.toArray(props.children).filter((e) => !!e).length;
    if (count < 2) {
      return props.children;
    }
    const renderGap = (key: any) => {
      return <div style={{width: props.gap || 6}}  key={'gap' + key} />;
    };
    const result: Array<React.ReactNode> = [];
    React.Children.forEach(props.children, (child: any, index) => {
      if (index !== 0) {
        result.push(renderGap(index));
      }
      result.push(child);
    });
  
    return <Flex {...props}>{result}</Flex>;
};
export default Space