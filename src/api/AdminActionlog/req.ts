import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  name?: string;
  route?: number | string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  id: number;
}

export interface IEdit {
  id: number | null;
}

export interface IDel {
  id: number;
}
