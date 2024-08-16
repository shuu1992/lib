import { isMobile } from 'react-device-detect';
import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import UserAgent from '@pages/UserAgent';
import UserOnline from '@pages/UserOnline';
import UserMember from '@pages/UserMember';
import UserMoneyflow from '@pages/UserMoneyflow';
import UserLoginLog from '@pages/UserLoginLog';
import UserCreditflow from '@pages/UserCreditflow';
import UserGroup from '@pages/UserGroup';
// mobile
import MUserCreditflow from '@mpages/UserCreditflow';
import MUserLoginLog from '@mpages/UserLoginLog';
import MUserMoneyflow from '@mpages/UserMoneyFlow';
import MUserGroup from '@mpages/UserGroup';
import MUserAgent from '@mpages/UserAgent';
import MUserMember from '@mpages/UserMember';

import MUserOnline from '@mpages/UserOnline';

const UserRoutes = {
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
          path: 'user',
          children: [
            {
              path: 'agent',
              element: (
                <KeepAlive name="/user/agent" cacheKey="/user/agent">
                  <PageProvider>{isMobile ? <MUserAgent /> : <UserAgent />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'online',
              element: (
                <KeepAlive name="/user/online" cacheKey="/user/online">
                  <PageProvider>{isMobile ? <MUserOnline /> : <UserOnline />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'member',
              element: (
                <KeepAlive name="/user/member" cacheKey="/user/member">
                  <PageProvider>{isMobile ? <MUserMember /> : <UserMember />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'moneyflow',
              element: (
                <KeepAlive name="/user/moneyflow" cacheKey="/user/moneyflow">
                  <PageProvider>{isMobile ? <MUserMoneyflow /> : <UserMoneyflow />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'loginLog',
              element: (
                <KeepAlive name="/user/loginLog" cacheKey="/user/loginLog">
                  <PageProvider>{isMobile ? <MUserLoginLog /> : <UserLoginLog />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'creditflow',
              element: (
                <KeepAlive name="/user/creditflow" cacheKey="/user/creditflow">
                  <PageProvider>{isMobile ? <MUserCreditflow /> : <UserCreditflow />}</PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'group',
              element: (
                <KeepAlive name="/user/group" cacheKey="/user/group">
                  <PageProvider>{isMobile ? <MUserGroup /> : <UserGroup />}</PageProvider>
                </KeepAlive>
              ),
            },
          ],
        },
      ],
    },
  ],
};

export default UserRoutes;
