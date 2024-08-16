import { PageReq } from '@api/baseReq';
export interface IChartOnline extends PageReq {
  per: number;
  minute_time1: string;
  minute_time2: string;
}
