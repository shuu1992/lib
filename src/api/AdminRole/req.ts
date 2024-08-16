import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  name?: string;
  status?: number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  name: string;
  allow_nav: number[];
  status: number | string;
}

export interface IEdit {
  id: number | null;
  name: string;
  allow_nav: number[];
  status: number | string;
}

export interface IDel {
  id: number;
}
