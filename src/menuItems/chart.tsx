// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const chart: NavItemType = {
  title: 'menu.chartFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/chart',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.chartOnline',
      name: '',
      type: 'item',
      url: '/chart/online',
    },
  ],
};

export default chart;
