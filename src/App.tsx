import { useEffect, useState } from 'react';
import './i18n/index';
import { dispatch } from '@store/index';
import ThemeCustomization from '@themes/index';
import { SnackbarProvider } from 'notistack';
import { JWTProvider as AuthProvider } from '@src/contexts/JWTContext';
import i18n from '@i18n/index';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AliveScope } from 'react-activation';
import { apiSystime } from '@api/Auth';
import { actionSystime } from '@store/reducers/global';
import Loadable from '@components/Loadable';
import globalRouter from '@utils/globalRouter';
import Router from './router/index';

const App = () => {
  const { t } = useTranslation();
  const fcSystime = async () => {
    try {
      const { data } = await apiSystime();
      dispatch(actionSystime({ sysTime: data.time }));
    } catch (error: any) {
      throw error;
    }
  };
  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  useEffect(() => {
    fcSystime();
    const lang = window.localStorage.getItem('lang');
    if (lang === null || lang === undefined) {
      window.localStorage.setItem('lang', i18n.language);
    } else {
      i18n.changeLanguage(lang);
    }
  }, []);

  return (
    <ThemeCustomization>
      <AuthProvider>
        <SnackbarProvider>
          <AliveScope>
            <Loadable>
              <Router />
            </Loadable>
          </AliveScope>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeCustomization>
  );
};

export default App;
