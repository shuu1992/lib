import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  pid?: string | number;
  room_id?: string | number;
  agent_id?: string;
  agent_paths?: number;
  report_time1?: string;
  report_time2?: string;
}
export interface IInfo {
  id: number | string;
}

export interface IAdd {
  id: number | null;
}

export interface IEdit {
  id: number | null;
}

export interface IDel {
  id: number;
}
