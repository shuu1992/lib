import login from './login.json';
import system from './system.json';
import lang from './lang.json';
import validation from './validation.json';
import compoent from './compoent.json';
import dashboard from './dashboard.json';
import menu from './menu.json';
import userAgent from './userAgent.json';
import userMember from './userMember.json';
import userOnline from './userOnline.json';
import userGroup from './userGroup.json';
import userCreditflow from './userCreditflow.json';
import userMoneyflow from './userMoneyflow.json';

import adminRole from './adminRole.json';
import adminUser from './adminUser.json';
import adminNav from './adminNav.json';
import adminActionlog from './adminActionlog.json';
import adminLoginLog from './adminLoginLog.json';
import adminClearCache from './adminClearCache.json';
import adminLanguage from './adminLanguage.json';

import profileUser from './profileUser.json';
import game from './game.json';
import gamePlatform from './gamePlatform.json';
import gamePlatformSet from './gamePlatformSet.json';
import gamePlatformType from './gamePlatformType.json';
import gameBetRecord from './gameBetRecord.json';
import gameDonate from './gameDonate.json';

import siteConfig from './siteConfig.json';
import siteBanner from './siteBanner.json';
import siteNotice from './siteNotice.json';
import siteMessage from './siteMessage.json';
export default {
  login,
  dashboard,
  menu,
  lang, // 語系
  sys: system, // 系統
  vt: validation, // 驗證
  cp: compoent, // 元件
  //user
  userMember,
  userAgent,
  userOnline,
  userGroup,
  userCreditflow,
  userMoneyflow,
  //admin
  adminNav,
  adminUser,
  adminRole,
  adminAclog: adminActionlog,
  adminLoginLog,
  adminClearCache,
  adminLanguage,
  //game
  game,
  gamePlatform,
  gamePlatformSet,
  gamePlatformType,
  gameBetRc: gameBetRecord,
  gameDonate,
  //site
  siteConfig,
  siteBanner,
  siteNotice,
  siteMessage,
  //other
  profileUser,
  //member
};
