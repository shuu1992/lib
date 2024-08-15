import login from './login.json';
import system from './system.json';
import lang from './lang.json';
import validation from './validation.json';
import compoent from './compoent.json';
import dashboard from './dashboard.json';
import menu from './menu.json';
import userAgent from './userAgent.json';
import userOnline from './userOnline.json';
import userMember from './userMember.json';
import userMoneyflow from './userMoneyflow.json';
import userLoginLog from './userLoginLog.json';
import userCreditflow from './userCreditflow.json';
import userGroup from './userGroup.json';
import gameManage from './gameManage.json';
import gameRoom from './gameRoom.json';
import gameBet from './gameBet.json';
import gameBetRecord from './gameBetRecord.json';
import gameDonate from './gameDonate.json';
import riskManage from './riskManage.json';
import riskHedging from './riskHedging.json';
import riskAnalysis from './riskAnalysis.json';
import report from './report.json';
import reportOperation from './reportOperation.json';
import reportAgent from './reportAgent.json';
import reportUser from './reportUser.json';
import reportGame from './reportGame.json';
import reportDonate from './reportDonate.json';
import siteConfig from './siteConfig.json';
import siteBanner from './siteBanner.json';
import siteNotice from './siteNotice.json';
import adminRole from './adminRole.json';
import adminUser from './adminUser.json';
import adminNav from './adminNav.json';
import adminActionlog from './adminActionlog.json';
import adminLoginLog from './adminLoginLog.json';
import adminClearCache from './adminClearCache.json';
import adminLanguage from './adminLanguage.json';
import profileUser from './profileUser.json';

export default {
  login,
  dashboard,
  menu,
  lang, // 語系
  sys: system, // 系統
  vt: validation, // 驗證
  cp: compoent, // 元件
  //user
  userAgent,
  userOnline,
  userMember,
  userMoneyflow,
  userLoginLog,
  userCreditflow,
  userGroup,
  //game
  gameManage,
  gameRoom,
  gameBet,
  gameBetRc: gameBetRecord,
  gameDonate: gameDonate,
  //risk
  riskManage,
  riskHedging,
  riskAnalysis,
  //report
  report,
  reportOperation,
  reportAgent,
  reportUser,
  reportGame,
  reportDonate,
  //site
  siteConfig,
  siteBanner,
  siteNotice,
  //admin
  adminNav,
  adminUser,
  adminRole,
  adminAclog: adminActionlog,
  adminLoginLog,
  adminClearCache,
  adminLanguage,

  //other
  profileUser,
};
