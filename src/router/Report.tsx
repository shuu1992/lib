import { isMobile } from 'react-device-detect';
import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import ReportOperation from '@pages/ReportOperation';
import ReportAgent from '@pages/ReportAgent';
import ReportUser from '@pages/ReportUser';
import ReportGame from '@pages/ReportGame';
import ReportDonate from '@pages/ReportDonate';

import MReportUser from '@mpages/ReportUser';
import MReportGame from '@mpages/ReportGame';
import MReportAgent from '@mpages/ReportAgent';
import MReportOperation from '@mpages/ReportOperation';
import MReportDonate from '@mpages/ReportDonate';

const ReportRoutes = {
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
          path: 'report',
          children: [
            {
              path: 'operation',
              element: (
                <KeepAlive name="/report/operation" cacheKey="/report/operation">
                  <PageProvider>
                    {isMobile ? <MReportOperation /> : <ReportOperation />}
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'agent',
              element: (
                <KeepAlive name="/report/agent" cacheKey="/report/agent">
                  <PageProvider>{isMobile ? <MReportAgent /> : <ReportAgent />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'user',
              element: (
                <KeepAlive name="/report/user" cacheKey="/report/user">
                  <PageProvider>
                    <PageProvider>{isMobile ? <MReportUser /> : <ReportUser />}</PageProvider>
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'game',
              element: (
                <KeepAlive name="/report/game" cacheKey="/report/game">
                  <PageProvider>
                    <PageProvider>{isMobile ? <MReportGame /> : <ReportGame />}</PageProvider>
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'donate',
              element: (
                <KeepAlive name="/report/donate" cacheKey="/report/donate">
                  <PageProvider>
                    <PageProvider>{isMobile ? <MReportDonate /> : <ReportDonate />}</PageProvider>
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

export default ReportRoutes;
