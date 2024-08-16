import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  type?: string | number;
  status?: number | number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  pid: string;
  level?: number | string;
  username: string;
  password: string;
  type: number | string;
  name: string;
  money_type?: number | string;
  money_limit?: number | string;
  share?: number;
  rakeback?: number;
  group_id?: number | string;
  status: number | string;
  wallet_type?: number | string;
  exclude_room_type: string;
  api_url?: string;
  remark?: string;
  ip_limit?: string;
}

export interface IEdit {
  id: string;
  pid?: string;
  username?: string;
  password?: string;
  type?: number | string;
  name?: string;
  money_type?: number | string;
  money_limit?: number | string;
  share?: number;
  rakeback?: number;
  group_id?: number | string;
  status?: number | string;
  wallet_type?: number | string;
  exclude_room_type: string;
  api_url?: string;
  remark?: string;
  ip_limit?: string;
  check_pwd?: string;
}

export interface IDel {
  id: number;
}

export interface ISCredit {
  id: number | string;
  credit: number;
  password: string;
  description: string;
}

export interface IRecycle {
  id: number | string;
  password: string;
  description: string;
}

export interface IChangeAgent {
  pid: number;
  id: number;
}
