export interface IResInfo {
  action_log: number;
  backstage: number;
  children: IResInfo[];
  created_at: string;
  created_by: string;
  final: number;
  icon: string;
  id: number;
  name: string;
  path: string;
  pid: number | string;
  pname: string;
  route: string;
  sort: number | string;
  status: number | string;
  updated_at: string;
  updated_by: string;
  url: string;
  action?: number;
}
