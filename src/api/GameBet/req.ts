import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  type?: string | number;
  status?: number | number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  id: number | null;
}

export interface IEdit {
  id: number | null;
  odds: number;
  odds2: number;
  sort: number;
  values: string;
  brief: string;
}

export interface IDel {
  id: number;
}
