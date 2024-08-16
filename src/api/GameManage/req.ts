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
  sort: number | string;
  status: number | string;
}

export interface IEdit {
  id: number | null;
  name: string;
  sort: number | string;
  status: number | string;
}

export interface IDel {
  id: number;
}
