import { lazy } from 'react';
import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import Copy from '@pages/Copy';

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
          path: 'test',
          children: [
            {
              path: 'index',
              element: (
                <KeepAlive name="/test/index" cacheKey="/test/index">
                  <PageProvider>
                    <Copy />
                  </PageProvider>
                </KeepAlive>
              ),
            },
          ],
        },
      ],
    },
  ],
};

export default MainRoutes;
