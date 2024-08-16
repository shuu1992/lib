export interface IResInfo {
  id: number;
  login_count: number;
  login_ip: string;
  login_time: string;
  role_id: number | string;
  rolename: string;
  status: number;
  username: string;
  action?: number; // 編輯用
}
