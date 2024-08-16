import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList } from './req';
import { IReportPageRes, IResInfo } from './res';
/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/report_donate',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, IReportPageRes<IResInfo[]>>(config);
}
