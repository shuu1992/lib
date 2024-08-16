import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  room_id?: string;
  room_type?: string;
  username?: string;
  report_time1?: string;
  report_time2?: string;
  agent_path?: string; //代理報表查詢投注人數
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
