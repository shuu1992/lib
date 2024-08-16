// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const user: NavItemType = {
  title: 'menu.userFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/user',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.userAgent',
      name: '',
      type: 'item',
      url: '/user/agent',
    },
    {
      title: 'menu.userOline',
      name: '',
      type: 'item',
      url: '/user/online',
    },
    {
      title: 'menu.userMember',
      name: '',
      type: 'item',
      url: '/user/member',
    },
    {
      title: 'menu.userMoneyflow',
      name: '',
      type: 'item',
      url: '/user/moneyflow',
    },
    {
      title: 'menu.userLoginLog',
      name: '',
      type: 'item',
      url: '/user/loginLog',
    },
    {
      title: 'menu.userCreditflow',
      name: '',
      type: 'item',
      url: '/user/creditflow',
    },
    {
      title: 'menu.userGroup',
      name: '',
      type: 'item',
      url: '/user/group',
    },
  ],
};

export default user;
