export interface IUserPageRes<T> {
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
  payoff: number;
  payout: number;
  rakeback: number;
  rebate: number;
  uid: number;
  username: string;
  donate: number;
  turn_in: number;
}

export interface IResFooter {
  bet_count: number;
  bet_real: number;
  bet_total: number;
  donate: number;
  payoff: number;
  payout: number;
  rebate: number;
  turn_in: number;
}
