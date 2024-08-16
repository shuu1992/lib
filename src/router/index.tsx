import { useRoutes } from 'react-router-dom';
import LoginRoutes from './Login';
import DashboardRoutes from './Dashboard';
import UserRoutes from './User';
import RechargeRoutes from './Recharge';
import GameRoutes from './Game';
import RiskRoutes from './Risk';
import ReportRoutes from './Report';
import SiteRoutes from './Site';
import ChartRoutes from './Chart';
import AdminRoutes from './Admin';
import ProfileRoutes from './Profile';
import RdRoutes from './Rd';
import TestRoutes from './Test';
//single
import Error404 from '@pages/Error404';
import ComingSoon from '@pages/ComingSoon';

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '*',
      element: <Error404 />,
    },
    {
      path: '/comingsoon',
      element: <ComingSoon />,
    },
    LoginRoutes,
    DashboardRoutes,
    UserRoutes,
    RechargeRoutes,
    GameRoutes,
    RiskRoutes,
    ReportRoutes,
    SiteRoutes,
    ChartRoutes,
    AdminRoutes,
    ProfileRoutes,
    RdRoutes,
    TestRoutes,
  ]);
}
