import React, { createContext, useState, useEffect, useReducer } from 'react';
// third-party
import { useSnackbar, SharedProps } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';
// reducer - state management
import authReducer from '@store/reducers/auth';
import { dispatch } from '@store/index';
import { actionUpdateUser, actionLogout } from '@store/reducers/auth';
import { actionInitial } from '@store/reducers/menu';
// project import
import { useAliveController } from 'react-activation';
import Loader from '@components/Loaders';
import { KeyedObject } from '@type/root';
import { AuthProps, JWTContextType } from '@type/auth';
import { apiProfile } from '@api/Auth';
import { fetchMenu } from '@store/reducers/menu';
// constant
const authInitialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const aliveController = useAliveController();
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') {
      window.localStorage.removeItem('token');
      fcLogout();
    }
  }, [location]);

  useEffect(() => {
    if (authState.isLoggedIn) {
      init();
      dispatch(fetchMenu());
    }
  }, [authState.isLoggedIn]);

  useEffect(() => {
    if (authState.user?.backstage === 2) {
      if (authState.user?.flag !== null && (authState.user?.flag & 1) === 0) {
        navigate('profile/user');
      }
    }
  }, [authState.user?.flag, location.pathname]);

  const init = async () => {
    try {
      const token = window.localStorage.getItem('token');
      if (token && verifyToken(token)) {
        const { data } = await apiProfile();
        authDispatch(
          actionUpdateUser({
            user: {
              role_id: data.role_id,
              role_name: data.role_name,
              username: data.username,
              created_at: data.created_at,
              login_ip: data.login_ip,
              login_count: data.login_count,
              login_time: data.login_time,
              backstage: data.backstage,
              flag: data.flag,
              money_type: data.money_type,
            },
          }),
        );
      } else {
        fcLogout();
      }
    } catch (err) {
      dispatch(actionInitial());
      fcLogout();
    }
  };

  const fcLogout = async () => {
    if (aliveController?.clear) {
      aliveController.clear();
    }
    dispatch(actionInitial());
    authDispatch(actionLogout());
  };

  if (authState.isInitialized !== undefined && !authState.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ authState, authDispatch }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
