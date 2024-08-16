import { PageReq } from '@api/baseReq';
export interface IList {
  groupid: number | string;
  type: number | string;
  skey: string;
  svalue: string;
  info: string;
  sort: number | string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  groupid: number | string;
  type: number | string;
  skey: string;
  svalue: string;
  info: string;
  sort: number | string;
}

export interface IEdit {
  id: number | null;
  type: number | string;
  skey: string;
  svalue: string;
  info: string;
  sort: number | string;
}

export interface IDel {
  id: number;
}
