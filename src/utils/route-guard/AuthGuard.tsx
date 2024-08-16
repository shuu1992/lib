import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: { children: React.ReactElement }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigate('login', {
        state: {
          from: location.pathname,
        },
        replace: true,
      });
    }
  }, [authState.isLoggedIn, navigate, location]);

  return children;
};

export default AuthGuard;
