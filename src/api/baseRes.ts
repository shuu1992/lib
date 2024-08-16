export interface BaseRes<T> {
  code: number;
  data: T;
  message: string;
}

export interface PageRes<T> {
  code: number;
  data: T;
  refer: any;
  meta: {
    last_page: number;
    page: number;
    per_page: number;
    total: number;
  };
  message: string;
}
