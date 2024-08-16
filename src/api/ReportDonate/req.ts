import { PageReq } from '@api/baseReq';

export interface IList extends PageReq {
  anchor_id?: string;
  report_time1?: string;
  report_time2?: string;
}
