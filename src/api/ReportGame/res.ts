export interface IGamePageRes<T> {
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
  bet_count: number;
  bet_real: number;
  bet_total: number;
  game_id: number;
  payoff: number;
  payout: number;
  rebate: number;
  room: string;
  room_id: number;
}

export interface IResFooter {
  bet_count: number;
  bet_real: number;
  bet_total: number;
  payoff: number;
  payout: number;
  rebate: number;
  donate: number;
}
