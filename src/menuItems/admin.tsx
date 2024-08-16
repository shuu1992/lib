// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const admin: NavItemType = {
  title: 'menu.admin',
  name: '',
  type: 'collapse',
  icon: 'ChromeOutlined',
  url: '/admin',
  children: [
    {
      title: 'menu.adminNav',
      name: '',
      type: 'item',
      url: '/admin/nav',
    },
    {
      title: 'menu.adminRole',
      name: '',
      type: 'item',
      url: '/admin/role',
    },
    {
      title: 'menu.adminUser',
      name: '',
      type: 'item',
      url: '/admin/user',
    },
    {
      title: 'menu.adminActionLog',
      name: '',
      type: 'item',
      url: '/admin/actionlog',
    },
    {
      title: 'menu.adminLoginLog',
      name: '',
      type: 'item',
      url: '/admin/loginlog',
    },
    {
      title: 'menu.adminClearCahe',
      name: '',
      type: 'item',
      url: '/admin/clearcache',
    },
    {
      title: 'menu.adminLanguage',
      name: '',
      type: 'item',
      url: '/admin/language',
    },
  ],
};

export default admin;
