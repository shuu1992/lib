import { isMobile } from 'react-device-detect';
import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import RiskManage from '@pages/RiskManage';
import RiskHedging from '@pages/RiskHedging';
import RiskAnalysis from '@pages/RiskAnalysis';

import MRiskHedging from '@mpages/RiskHedging';
import MRiskManage from '@mpages/RiskManage';
import MRiskAnalysis from '@mpages/RiskAnalysis';

const RiskRoutes = {
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
          path: 'risk',
          children: [
            {
              path: 'manage',
              element: (
                <KeepAlive name="/risk/manage" cacheKey="/risk/manage">
                  <PageProvider>{isMobile ? <MRiskManage /> : <RiskManage />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'hedging',
              element: (
                <KeepAlive name="/risk/hedging" cacheKey="/risk/hedging">
                  <PageProvider>{isMobile ? <MRiskHedging /> : <RiskHedging />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'analysis',
              element: (
                <KeepAlive name="/risk/analysis" cacheKey="/risk/analysis">
                  <PageProvider>{isMobile ? <MRiskAnalysis /> : <RiskAnalysis />}</PageProvider>
                </KeepAlive>
              ),
            },
          ],
        },
      ],
    },
  ],
};

export default RiskRoutes;
