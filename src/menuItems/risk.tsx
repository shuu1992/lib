import {
  ChromeOutlined,
  CustomerServiceOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

// type
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const risk: NavItemType = {
  title: 'menu.riskFeature',
  name: '',
  type: 'collapse',
  icon: 'CustomerServiceOutlined',
  url: '/risk',
  breadcrumbs: true,
  children: [
    {
      title: 'menu.riskManage',
      name: '',
      type: 'item',
      url: '/risk/manage',
    },
    {
      title: 'menu.riskHedging',
      name: '',
      type: 'item',
      url: '/risk/hedging',
    },
    {
      title: 'menu.riskAnalysis',
      name: '',
      type: 'item',
      url: '/risk/analysis',
    },
  ],
};

export default risk;
