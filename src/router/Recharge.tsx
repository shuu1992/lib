import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import RechargeDepRec from '@pages/RechargeDepRec';

const RechargeRoutes = {
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
          path: 'recharge',
          children: [
            {
              path: 'depRec',
              element: (
                <KeepAlive name="/recharge/depRec" cacheKey="/recharge/depRec">
                  <PageProvider>
                    <RechargeDepRec />
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

export default RechargeRoutes;
