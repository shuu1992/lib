import { PageProvider } from '@src/contexts/PageContext';
import AuthGuard from '@utils/route-guard/AuthGuard';
import { KeepAlive } from 'react-activation';
// Layout
import MainLayout from '@layout/MainLayout/index';
import SiteConfig from '@pages/SiteConfig';
import SiteNotice from '@pages/SiteNotice';
import SiteBanner from '@pages/SiteBanner';

const SiteRoutes = {
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
          path: 'site',
          children: [
            {
              path: 'config',
              element: (
                <KeepAlive name="/site/config" cacheKey="/site/config">
                  <PageProvider>
                    <SiteConfig />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'notice',
              element: (
                <KeepAlive name="/site/notice" cacheKey="/site/notice">
                  <PageProvider>
                    <SiteNotice />
                  </PageProvider>
                </KeepAlive>
              ),
            },
            {
              path: 'banner',
              element: (
                <KeepAlive name="/site/banner" cacheKey="/site/banner">
                  <PageProvider>
                    <SiteBanner />
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

export default SiteRoutes;
