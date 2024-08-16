import { ReactNode } from 'react';
// material-ui
import { ChipProps } from '@mui/material';

import { GenericCardProps } from './root';

// ==============================|| MENU TYPES  ||============================== //

export type NavItemType = {
  id?: string | number;
  type?: string;
  title?: string;
  name?: string;
  icon?: string;
  children?: NavItemType[];
  url?: string | undefined;
  elements?: NavItemType[];
  color?: 'primary' | 'secondary' | 'default' | undefined;
  disabled?: boolean;
  external?: boolean;
  target?: boolean;
  chip?: ChipProps;
  breadcrumbs?: boolean;
  caption?: ReactNode | string;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type MenuProps = {
  openItem: string[];
  selectedID: string | null;
  selectedItem: any; // 當前選擇的項目
  allPermission: string[]; // 所有權限
  historySelect: any[];
  drawerOpen: boolean;
  menuItems: any;
  defaultMenu: any;
};
