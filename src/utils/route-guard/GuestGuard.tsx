import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_DEFAULT_PATH } from '@src/config';
import useAuth from '@hooks/useAuth';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }: { children: React.ReactElement }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (authState.isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH, {
        state: {
          from: '',
        },
        replace: true,
      });
    } else {
      location.state = null;
    }
  }, [authState.isLoggedIn, navigate, location]);

  return children;
};

export default GuestGuard;
