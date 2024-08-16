import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  backstage?: string;
  username?: string;
  nav_id?: string;
  ip?: string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  pid: number;
  icon: string;
  name: string;
  route: string;
  url: string;
  sort: number | string;
  action_log: number;
  status: number | string;
}

export interface IEdit {
  id: number | null;
  icon: string;
  name: string;
  route: string;
  url: string;
  sort: number | string;
  action_log: number;
  status: number | string;
}

export interface IDel {
  id: number;
}
