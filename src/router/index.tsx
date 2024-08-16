import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginRoutes from './Login';

const router = createBrowserRouter(
  [
    LoginRoutes,
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  { basename: '/' },
);

export default router;
