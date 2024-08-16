export type FontFamily =
  | `'Inter', sans-serif`
  | `'Poppins', sans-serif`
  | `'Roboto', sans-serif`
  | `'Public Sans', sans-serif`;
export type PresetColor =
  | 'default'
  | 'theme1'
  | 'theme2'
  | 'theme3'
  | 'theme4'
  | 'theme5'
  | 'theme6'
  | 'theme7'
  | 'theme8';
export type I18n = 'en' | 'zh_TW';

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

// ==============================|| CONFIG TYPES ||============================== //

export type DefaultConfigProps = {
  /**
   * The props used for the theme font-style.
   * We provide static below options -
   * `'Inter', sans-serif`
   * `'Poppins', sans-serif`
   * `'Roboto', sans-serif`
   * `'Public Sans', sans-serif` (default)
   */
  fontFamily: FontFamily;

  /**
   * The props used for display menu-items with multi-language.
   * We provide static below languages according to 'react-intl' options - https://www.npmjs.com/package/react-intl
   * 'en' (default)
   * 'fr'
   * 'ro'
   * 'zh'
   */
  i18nLang: I18n;

  /**
   * the props used for default theme palette mode
   * explore the default theme
   * below theme options -
   * 'light' (default) - ThemeMode.LIGHT
   * 'dark' - ThemeMode.DARK
   */
  mode: ThemeMode;

  /**
   * the props used for theme primary color variants
   * we provide static below options thoe s are already defaine in src/themes/theme -
   * 'default'
   * 'theme1'
   * 'theme2'
   * 'theme3'
   * 'theme4'
   * 'theme5'
   * 'theme6'
   * 'theme7'
   * 'theme8'
   */
  presetColor: PresetColor;
};

export type CustomizationProps = {
  fontFamily: FontFamily;
  i18nLang: I18n;
  mode: ThemeMode;
  onChangeLocalization: (lang: I18n) => void;
  onChangeMode: (mode: ThemeMode) => void;
  onChangeFontFamily: (fontFamily: FontFamily) => void;
};
