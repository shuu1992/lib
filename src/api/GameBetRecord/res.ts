export interface IGameBetRecRes<T> {
  code: number;
  data: T;
  refer: any;
  header: null | any;
  footer: IResFooter;
  meta: {
    last_page: number;
    page: number;
    per_page: number;
    total: number;
  };
  message: string;
}
export interface IResInfo {
  bet_no: string;
  bet_real: number;
  bet_total: number;
  betarea: string;
  betarea_id: number;
  game_id: number;
  game_no: string;
  id: number;
  is_lose_win: number;
  odds: number;
  payoff: number;
  payout: number;
  payout_time: string;
  rebate: string;
  record: null | string;
  report_time: string;
  room_id: number;
  status: number;
  uid: number;
  username: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  action?: number;
}

export interface IResFooter {
  bet_real: number;
  bet_total: number;
  payoff: number;
  payout: number;
}
