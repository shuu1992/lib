import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  type?: string | number;
  status?: string | number;
  created_at1?: string;
  created_at2?: string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  type: string;
  name: string;
  content: string;
  start_time: string;
  end_time: string;
  sort?: number | string;
  status: number | string;
  flag: number | string;
}

export interface IEdit {
  id: number | null;
  type: number;
  name: string;
  content: string;
  start_time: string;
  end_time: string;
  sort: number | string;
  status: number | string;
  flag: number | string;
}

export interface IDel {
  id: number;
}
