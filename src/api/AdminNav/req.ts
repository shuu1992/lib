import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  name?: string;
  route?: number | string;
  status?: number | string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  pid: number | string;
  icon: string;
  name: string;
  route: string;
  url: string;
  sort: number | string;
  action_log: number;
  status: number | string;
}

export interface IEdit {
  id: number | string;
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
