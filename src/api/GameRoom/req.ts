import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  type?: string | number;
  status?: number | number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  name: string;
  game_id: number | string;
  type: number | string;
  anchor_id: number | string;
  live_id: number | string;
  hot: number | string;
  sort: number | string;
  status: number | string;
}

export interface IEdit {
  id: number | null;
  game_id: number | string;
  type: number | string;
  anchor_id: number | string;
  live_id: number | string;
  hot: number | string;
  sort: number | string;
  status: number | string;
}

export interface IDel {
  id: number;
}
