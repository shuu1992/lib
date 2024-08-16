import { lazy } from 'react';
// project imports
import Loadable from '@components/Loadable';
import SimpleLayout from '@layout/SimpleLayout';
const Login = Loadable(lazy(() => import('@pages/Login')));

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <SimpleLayout />,
      children: [
        {
          path: '/',
          element: <Login />,
        },
      ],
    },
  ],
};
export default LoginRoutes;
