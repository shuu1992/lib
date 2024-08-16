export interface IOpPageRes<T> {
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
  bet_user: number;
  payoff: number;
  payout: number;
  rebate: number;
  donate: number;
  report_date?: string;
  week?: string;
  week_end?: string;
  week_start?: string;
  year?: string;
}

export interface IResFooter {
  bet_count: number;
  bet_real: number;
  bet_total: number;
  bet_user: number;
  payoff: number;
  payout: number;
  rebate: number;
  donate: number;
}
