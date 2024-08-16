import { BaseRes } from '@api/baseRes';
import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { ILoginReq, IUpdatePasswordReq } from './req';
import { ILoginRes, ISideBarMenuRes, ITopinfo, ISystime, ILanguage, IResInfo } from './res';

/**登入 */
export async function apiLogin(postData: ILoginReq) {
  const config: AxiosRequestConfig = {
    url: '/login',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<ILoginRes>>(config);
}
/**使用者資訊 */
export async function apiProfile() {
  const config: AxiosRequestConfig = {
    url: '/profile',
    method: 'GET',
  };
  return await axios.request<any, BaseRes<ILoginRes>>(config);
}

/**使用者MenuBar */
export async function apiSidebar() {
  const config: AxiosRequestConfig = {
    url: '/sidebar',
    method: 'GET',
  };
  return await axios.request<any, BaseRes<ISideBarMenuRes>>(config);
}

/**首頁資訊 */
export async function apiTopinfo() {
  const config: AxiosRequestConfig = {
    url: '/getTopInfo',
    method: 'GET',
  };
  return await axios.request<any, BaseRes<ITopinfo>>(config);
}

/**系統時間 */
export async function apiSystime() {
  const config: AxiosRequestConfig = {
    url: '/systime',
    method: 'GET',
  };
  return await axios.request<any, BaseRes<ISystime>>(config);
}
/**language */
export async function apiLanguage() {
  const config: AxiosRequestConfig = {
    url: '/language',
    method: 'GET',
  };
  return await axios.request<any, BaseRes<ILanguage>>(config);
}

export async function apiUpdatePassword(postData: IUpdatePasswordReq) {
  const config: AxiosRequestConfig = {
    url: '/updatepwd',
    method: 'POST',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, BaseRes<IResInfo>>(config);
}
