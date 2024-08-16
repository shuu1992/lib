import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import ChartOnlne from '@pages/ChartOnline';

const ChartRoutes = {
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
          path: 'chart',
          children: [
            {
              path: 'online',
              element: (
                <KeepAlive name="/chart/online" cacheKey="/chart/online">
                  <PageProvider>
                    <ChartOnlne />
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

export default ChartRoutes;
