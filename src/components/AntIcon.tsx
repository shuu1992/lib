import { ForwardRefExoticComponent } from 'react';
import Icon from '@ant-design/icons';
import * as icons from '@ant-design/icons';

function AntIcon({ iconName, style }: { iconName: string; style?: any }) {
  return (
    <Icon component={icons[iconName as never] as ForwardRefExoticComponent<any>} style={style} />
  );
}

export default AntIcon;
