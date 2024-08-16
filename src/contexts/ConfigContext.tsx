import { createContext, ReactNode } from 'react';

// project import
import config from '../config';
import useLocalStorage from '@hooks/useLocalStorage';

// types
import { CustomizationProps, FontFamily, I18n, ThemeMode } from '@type/config';

// initial state
const initialState: CustomizationProps = {
  ...config,
  onChangeLocalization: (lang: I18n) => {},
  onChangeMode: (mode: ThemeMode) => {},
  onChangeFontFamily: (fontFamily: FontFamily) => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useLocalStorage(
    `${import.meta.env.VITE_HTML_TITLE}-config`,
    initialState,
  );

  const onChangeLocalization = (lang: I18n) => {
    setConfig({
      ...config,
      i18nLang: lang,
    });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...config,
      mode,
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...config,
      fontFamily,
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeLocalization,
        onChangeMode,
        onChangeFontFamily,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };
