// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const user: NavItemType = {
  title: 'menu.siteFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/site',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.siteConfig',
      name: '',
      type: 'item',
      url: '/site/config',
    },
    {
      title: 'menu.siteNotice',
      name: '',
      type: 'item',
      url: '/site/notice',
    },
    {
      title: 'menu.siteBanner',
      name: '',
      type: 'item',
      url: '/site/banner',
    },
  ],
};

export default user;
