// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

// 單獨一個時不需要 title name
const dashboard: NavItemType = {
  id: 'dashboard1',
  type: 'group',
  url: '/dashboard',
  children: [
    {
      id: 'dashboard1',
      title: 'menu.dashboard',
      type: 'item',
      url: '/dashboard/index',
      icon: 'CustomerServiceOutlined',
    },
  ],
};

export default dashboard;
