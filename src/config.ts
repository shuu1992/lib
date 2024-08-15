// types
import { DefaultConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from './types/config';

// ==============================|| THEME CONSTANT  ||============================== //

export const APP_DEFAULT_PATH = '/dashboard/index';
export const HORIZONTAL_MAX_ITEM = 6;
export const DRAWER_WIDTH = 260;

// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
  fontFamily: `'Microsoft JhengHei',Microsoft Yahei,Helvetica,Hiragino Sans GB,Arial, sans-serif, serif`,
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  themeDirection: ThemeDirection.LTR,
};

export default config;
