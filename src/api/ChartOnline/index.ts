import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IChartOnline } from './req';
import { IResChartOnline } from './res';

/** ChartOnline*/
export async function apiChartOnline(postData: IChartOnline) {
  const config: AxiosRequestConfig = {
    url: '/online_count',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, PageRes<IResChartOnline[]>>(config);
}
