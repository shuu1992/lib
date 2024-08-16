export interface IResInfo {
  id: number | string;
  bet_money?: number;
  created_at: string;
  created_by: string;
  group_id: number | string;
  level?: number;
  login_ip: string;
  login_time: string;
  money: number;
  money_limit: number;
  money_type: number | string;
  name: string;
  path?: string;
  pid?: number;
  register_ip: string;
  remark: string;
  rakeback: number | string;
  status: number | string;
  type: number | string;
  updated_at: string;
  updated_by: string;
  username: string;
  action?: number;
}
