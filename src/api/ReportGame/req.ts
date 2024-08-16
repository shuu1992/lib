import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  agent_paths?: string;
  room_type?: string;
  report_time1?: string;
  report_time2?: string;
}
export interface IInfo {
  id: number;
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
