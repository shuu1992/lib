export interface ISelect {
  name: string;
  value: string;
}

//table select
export interface TbSelectProps {
  text: string;
  value: string;
}

//list 搜尋參數
export interface PgListProps {
  pageIndex: number;
  pageSize: number;
  searchCfg: any;
}

//分頁 搜尋
export interface PgCfgProps {
  pageIndex: number;
  pageSize: number;
  pageTotal: number;
}

export interface TbMetaProps {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}
