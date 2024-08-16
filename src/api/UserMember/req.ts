import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  agent_id?: string | number;
  username?: string;
  name?: string;
  status?: number | number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  agent_id: number | string;
  username: string;
  password: string;
  name: string;
  money_limit: number;
  rakeback: number;
  group_id: number | string;
  status: number | string;
  remark: string;
}

export interface IEdit {
  id: number | string;
  password?: string;
  name?: string;
  money_limit?: string | number;
  rakeback?: number;
  group_id?: number | string;
  status?: number | string;
  remark?: string;
  check_pwd: string;
}

export interface IDel {
  id: number;
}

export interface ISMoney {
  id: number | string;
  money: number;
  password: string;
  retract?: number;
  description: string;
}

export interface IEUser extends PageReq {
  agent_id?: number | string;
  username?: string;
  name?: string;
  status?: number | string;
}

export interface IResetLose {
  id: number | string;
}
