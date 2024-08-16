import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList, IInfo, IAdd, IEdit, IDel } from './req';
import { IResInfo } from './res';
/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/user_login_log',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, PageRes<IResInfo[]>>(config);
}

/** Info*/
export async function apiInfo(postData: IInfo) {
  const config: AxiosRequestConfig = {
    url: '/user_login_log/' + postData.id,
    method: 'GET',
  };
  return await axios.request<any, BaseRes<IResInfo>>(config);
}

/** Add*/
export async function apiAdd(postData: IAdd) {
  const config: AxiosRequestConfig = {
    url: '/user_login_log',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Edit*/
export async function apiEdit(postData: IEdit) {
  const config: AxiosRequestConfig = {
    url: '/user_login_log/' + postData.id,
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Del*/
export async function apiDel(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/user_login_log/' + postData.id,
    method: 'DELETE',
  };
  return await axios.request<any, BaseRes<[]>>(config);
}
