import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import Rdi18n from '@pages/RDi18n';

const RdRoutes = {
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
          path: 'rd',
          children: [
            {
              path: 'i18n',
              element: (
                <KeepAlive name="/rd/i18n" cacheKey="/rd/i18n">
                  <PageProvider>
                    <Rdi18n />
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

export default RdRoutes;
