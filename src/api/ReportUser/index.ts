import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList, IInfo, IAdd, IEdit, IDel } from './req';
import { IUserPageRes, IResInfo } from './res';
/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/report_user',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, IUserPageRes<IResInfo[]>>(config);
}
