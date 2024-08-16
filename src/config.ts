// types
import { DefaultConfigProps, ThemeMode } from './types/config';
import { I18n } from '@type/config';
// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
  fontFamily: `'Public Sans', sans-serif`,
  i18nLang: import.meta.env.VITE_I18N_LANG as I18n,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
};

export default config;
