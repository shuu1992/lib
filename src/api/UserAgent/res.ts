export interface IAgPageRes<T> {
  code: number;
  data: T;
  refer: any;
  header: null | any;
  breadcrumbs: { id: number; name: string }[];
  meta: {
    last_page: number;
    page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface IResInfo {
  created_at: string;
  created_by: string;
  credit: number;
  currency: string;
  group_id: string;
  id: number | string;
  level: number;
  login_ip: string;
  login_time: string;
  money_limit: number;
  money_type: number;
  name: string;
  path: string;
  pid: string;
  ip_limit: string;
  rakeback: number;
  remark: string;
  share: number;
  wallet_type: number | string;
  exclude_room_type: string;
  api_url: string;
  flag: number | string;
  status: number;
  type: number;
  updated_at: string;
  updated_by: string;
  user_count: number;
  username: string;
  agent_count: number;
  action?: number;
  agent_id?: number | string;
  appkey: string;
  appsecret: string;
  wtoken: string;
}

export interface IResTree {
  id: number;
  name: string;
  pid: number;
  username: string;
  children: IResTree[];
}

export interface IResTreeRes<T> {
  code: number;
  data: T;
}
