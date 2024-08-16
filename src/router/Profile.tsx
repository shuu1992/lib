import AuthGuard from '@utils/route-guard/AuthGuard';
import { PageProvider } from '@src/contexts/PageContext';

// Layout
import MainLayout from '@layout/MainLayout/index';
import ProfileUser from '@pages/ProfileUser';

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
          path: 'profile',
          children: [
            {
              path: 'user',
              element: (
                <PageProvider>
                  <ProfileUser />
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
