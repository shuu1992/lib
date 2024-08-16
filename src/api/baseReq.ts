export interface PageReq {
  page?: number; //代理報表查詢不需要帶入
  per_page: number;
  export?: number;
  sort_by?: string;
  created_at?: Array<string>;
  updated_at?: Array<string>;
}
