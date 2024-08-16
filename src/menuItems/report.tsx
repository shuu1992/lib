// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const report: NavItemType = {
  title: 'menu.reportFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/report',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.reportOperation',
      name: '',
      type: 'item',
      url: '/report/operation',
    },
    {
      title: 'menu.reportAgent',
      name: '',
      type: 'item',
      url: '/report/agent',
    },
    {
      title: 'menu.reportUser',
      name: '',
      type: 'item',
      url: '/report/user',
    },
    {
      title: 'menu.reportGame',
      name: '',
      type: 'item',
      url: '/report/game',
    },
    {
      title: 'menu.reportDonate',
      name: '',
      type: 'item',
      url: '/report/donate',
    },
  ],
};

export default report;
