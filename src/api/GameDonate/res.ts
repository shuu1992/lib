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
  anchor_id: number;
  created_at: string;
  created_by: string;
  donate: number;
  gift_count: number;
  gift_id: number;
  id: number;
  order_sn: string;
  room_id: number;
  status: number;
  uid: number;
  updated_at: string;
  updated_by: string;
  username: string;
}

export interface IResFooter {
  donate: number;
}
