export interface IResInfo {
  id: number;
  code_id: number | string;
  language: string;
  type: number;
  keystr: string;
  content: string;
  translate: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  action?: number;
}
