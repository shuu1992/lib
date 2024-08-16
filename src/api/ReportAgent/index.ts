import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList, IInfo, IAdd, IEdit, IDel } from './req';
import { IAgPageRes, IResInfo } from './res';
/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/report_agent',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, IAgPageRes<IResInfo[]>>(config);
}

/** Info*/
export async function apiInfo(postData: IInfo) {
  const config: AxiosRequestConfig = {
    url: '/report_agent/' + postData.id,
    method: 'GET',
  };
  return await axios.request<any, IAgPageRes<IResInfo[]>>(config);
}
