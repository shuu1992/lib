import { i18n } from 'i18next';
import { ReactElement, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useSnackbar, SharedProps } from 'notistack';
import { isMobile } from 'react-device-detect';
export type PageContextType = {
  t: i18n['t'];
  theme: any;
  isMobile: boolean;
  fcShowMsg: ({ type, msg }: { type?: string; msg: string }) => void;
};
const PageContext = createContext<PageContextType | null>(null);

export const PageProvider = ({ children }: { children: ReactElement }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //提示彈窗
  function fcShowMsg({ type = 'error', msg }: { type?: string; msg: string }) {
    enqueueSnackbar(msg, {
      variant: type as SharedProps['variant'],
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      autoHideDuration: 1000,
    });
  }

  return (
    <PageContext.Provider
      value={{
        t,
        theme,
        isMobile,
        fcShowMsg,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export default PageContext;
