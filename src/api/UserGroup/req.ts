import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  type?: string | number;
  status?: number | number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  name: string;
  bet_min: number;
  bet_max: number;
  status: number;
  sort: number;
}

export interface IEdit {
  id: number;
  name: string;
  bet_min: number;
  bet_max: number;
  status: number;
  sort: number;
}

export interface IDel {
  id: number;
}
