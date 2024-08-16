import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  name?: string;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  keystr: string;
  type: number | string;
  code_id: number | string;
  content: string;
}

export interface IEdit {
  id: number | null;
  keystr: string;
  type: number | string;
  code_id: number | string;
  content: string;
  translate: string | number;
}

export interface IDel {
  id: number;
}
