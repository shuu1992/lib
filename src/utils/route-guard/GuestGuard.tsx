import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import useAuth from '@hooks/useAuth';

// types
import { GuardProps } from '@type/auth';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }: GuardProps) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : '', {
        state: {
          from: '',
        },
        replace: true,
      });
    }
  }, [isLoggedIn, navigate, location]);

  return children;
};

export default GuestGuard;
