export interface IAgPageRes<T> {
  code: number;
  data: T;
  refer: any;
  header: null | any;
  header_detail: null | any;
  breadcrumbs: { id: number; name: string }[];
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
  agent_id: number;
  bet_count: number;
  bet_real: number;
  bet_total: number;
  donate: number;
  payoff: number;
  profit: number;
  rakeback: number;
  rebate: number;
  receivable: number;
  share: number;
  turn_in: number;
  username: string;
}
export interface IResFooter {
  money_total?: number;
  bite_total?: number;
  bet_count: number;
  bet_real: number;
  bet_total: number;
  donate: number;
  payoff: number;
  profit: number;
  rebate: number;
  receivable: number;
  turn_in: number;
}
