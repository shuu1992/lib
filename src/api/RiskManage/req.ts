import { PageReq } from '@api/baseReq';
export interface IList extends PageReq {
  type?: string | number;
  status?: number | number;
}
export interface IInfo {
  id: number;
}

export interface IAdd {
  start_time: string;
  end_time: string;
  room_id: number;
  payload?: any;
}

export interface IEdit {
  numbers?: string;
  start_time?: string;
  end_time?: string;
  status?: number;
  check_pwd: string;
  payload?: string;
}

export interface IDel {
  id: number;
}

export interface IOddsInfo {
  game_no: string;
  room_id: number;
}

export interface ISetOdds {
  game_no: string;
  room_id: number;
  betarea_id: number;
  adjust?: number;
}
