import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  room_id?: string;
  room_type?: string;
  username?: string;
  agent_paths?: string;
  report_date1?: string;
  report_date2?: string;
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
