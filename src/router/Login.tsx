import GuestGuard from '@utils/route-guard/GuestGuard';
import { PageProvider } from '@src/contexts/PageContext';
import CommonLayout from '@layout/CommonLayout/index';
import Login from '@pages/Login';
import ForgetPassword from '@pages/ForgetPassword';

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '/',
          element: (
            <PageProvider>
              <Login />
            </PageProvider>
          ),
        },
        {
          path: 'login',
          element: (
            <PageProvider>
              <Login />
            </PageProvider>
          ),
        },
        {
          path: 'forgetPaw',
          element: (
            <PageProvider>
              <ForgetPassword />
            </PageProvider>
          ),
        },
      ],
    },
  ],
};
export default LoginRoutes;
