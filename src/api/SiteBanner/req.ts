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
  id: number | string;
  created_at: string;
  created_by: string;
  end_time: string;
  image: string;
  image_app: string;
  sort: number | string;
  start_time: string;
  status: number | string;
  type: number;
  updated_at: string;
  updated_by: string;
  url: string;
}

export interface IEdit {
  id: number | null;
}

export interface IDel {
  id: number;
}
