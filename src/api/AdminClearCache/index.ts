import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';

/** Clear cache*/
export async function apiClear() {
  const config: AxiosRequestConfig = {
    url: '/cache/clear',
    method: 'GET',
  };
  return await axios.request<any, PageRes<[]>>(config);
}
