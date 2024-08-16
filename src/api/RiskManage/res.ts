export interface IResInfo {
  created_at: string;
  created_by: string;
  end_time: string;
  game_no: string;
  id: number;
  numbers: string;
  payload: any;
  room_id: number;
  rounds: number;
  rounds_no: number;
  start_time: string;
  status: number;
  updated_at: string;
  updated_by: string;
  action?: number;
  room_name?: string;
}
export interface ICardInfo {
  numbers: string;
  rounds: number;
  rounds_no: number;
  video: string;
  room_name: string;
  game_no: string;
}

export interface IResOdds {
  odds: number;
  odds2: number;
}
