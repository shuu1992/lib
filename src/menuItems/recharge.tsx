// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const recharge: NavItemType = {
  title: 'menu.rechargeFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/recharge',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.rechargeDepRec',
      name: '',
      type: 'item',
      url: '/recharge/depRec',
    },
  ],
};

export default recharge;
