// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

// 單獨一個時不需要 title name
const test: NavItemType = {
  id: 'test',
  type: 'group',
  url: '/test',
  children: [
    {
      id: 'test',
      title: 'menu.test',
      type: 'item',
      url: '/test/index',
      icon: 'HeatMapOutlined',
    },
  ],
};

export default test;
