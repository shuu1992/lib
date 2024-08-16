// project import
import dashboard from './dashbord';
import user from './user';
import recharge from './recharge';
import game from './game';
import risk from './risk';
import report from './report';
import site from './site';
import chart from './chart';
import admin from './admin';
// import test from './test';
// types
import { NavItemType } from '@type/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, user, recharge, game, risk, report, site, chart, admin],
};

export default menuItems;
