export interface IMemberPageRes<T> {
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
  agent_id: number;
  coin: any[];
  agent_path: { step: number; agent_id: number; username: string }[];
  created_at: string;
  created_by: string;
  group_id: number;
  id: number;
  login_ip: string;
  login_time: string;
  lose_limit: number;
  money: number;
  money_limit: number;
  money_type: number;
  payoff: number;
  name: string;
  check_pwd: string;
  rakeback: number;
  register_ip: string;
  remark: string;
  flag: number | string;
  status: number;
  type: number;
  updated_at: string;
  updated_by: string;
  username: string;
  action?: number;
}
