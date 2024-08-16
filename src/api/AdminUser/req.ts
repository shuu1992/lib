import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  username?: string;
  role_id?: number | string;
  status?: number | string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  username: string;
  password: string;
  role_id: string;
  status: number | string;
}

export interface IEdit {
  id: number | null;
  username: string;
  password?: string;
  role_id: number | string;
  status: number | string;
}

export interface IDel {
  id: number;
}
