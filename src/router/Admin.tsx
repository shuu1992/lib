import { isMobile } from 'react-device-detect';
import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import AdminNav from '@pages/AdminNav';
import AdminRole from '@pages/AdminRole';
import AdminUser from '@pages/AdminUser';
import AdminActionLog from '@pages/AdminActionLog';
import AdminLoginLog from '@pages/AdminLoginLog';
import AdminClearCache from '@pages/AdminClearCache';
import AdminLanguage from '@pages/AdminLanguage';

const AdminRoutes = {
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
          path: 'admin',
          children: [
            {
              path: 'nav',
              element: (
                <KeepAlive name="/admin/nav" cacheKey="/admin/nav">
                  <PageProvider>
                    <AdminNav />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'role',
              element: (
                <KeepAlive name="/admin/role" cacheKey="/admin/role">
                  <PageProvider>
                    <AdminRole />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'user',
              element: (
                <KeepAlive name="/admin/user" cacheKey="/admin/user">
                  <PageProvider>
                    <AdminUser />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'actionlog',
              element: (
                <KeepAlive name="/admin/actionlog" cacheKey="/admin/actionlog">
                  <PageProvider>
                    <AdminActionLog />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'loginlog',
              element: (
                <KeepAlive name="/admin/loginlog" cacheKey="/admin/loginlog">
                  <PageProvider>
                    <AdminLoginLog />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'clearcache',
              element: (
                <KeepAlive name="/admin/clearcache" cacheKey="/admin/clearcache">
                  <PageProvider>
                    <AdminClearCache />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'language',
              element: (
                <KeepAlive name="/admin/language" cacheKey="/admin/language">
                  <PageProvider>
                    <AdminLanguage />
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

export default AdminRoutes;
