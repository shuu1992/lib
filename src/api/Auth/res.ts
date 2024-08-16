export interface ILoginRes {
  created_at: string;
  id: number;
  login_ip: string;
  login_count: number;
  login_time: string;
  role_id: number;
  role_name: string;
  status: number | string;
  token: string;
  username: string;
  flag: number | null;
  backstage: number; //1:總後台 2:代理後台
  money_type: number; // 1:點數 2:金額
}
export interface ISideBarMenuBase {
  id: number;
  pid: number;
  icon: string;
  name: string;
  route: string;
  url: string | null;
  final: number;
}

export interface ISideBarMenuRes extends ISideBarMenuBase {
  children: { children: ISideBarMenuBase[] };
}

export interface ITopinfo {
  bet_real: number;
  bet_total: number;
  online: number;
  payoff: number;
  register: number;
}

export interface ISystime {
  time: string;
}

export interface ILanguage {
  [key: string]: string;
}

export interface IResInfo {
  id: number;
  action?: number;
}
