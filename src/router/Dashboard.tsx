import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import Dashboard from '@pages/Dashboard';
import Test from '@pages/Test';

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'index',
              element: (
                <KeepAlive name="/dashboard/index" cacheKey="/dashboard/index">
                  <PageProvider>
                    <Dashboard />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'test',
              element: (
                <PageProvider>
                  <Test />
                </PageProvider>
              ),
            },
          ],
        },
      ],
    },
  ],
};

export default MainRoutes;
