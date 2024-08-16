export interface IReportPageRes<T> {
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
  anchor_id: number;
  donate: number;
  donate_count: number;
}

export interface IResFooter {
  donate: number;
  donate_count: number;
}
