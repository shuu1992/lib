import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList, IInfo, IAdd, IEdit, IDel } from './req';
import { IResInfo, IGameBetRecRes } from './res';
/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/bet_record',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, IGameBetRecRes<IResInfo[]>>(config);
}

/** Info*/
export async function apiInfo(postData: IInfo) {
  const config: AxiosRequestConfig = {
    url: '/bet_record/' + postData.id,
    method: 'GET',
  };
  return await axios.request<any, IGameBetRecRes<IResInfo>>(config);
}

/** Add*/
export async function apiAdd(postData: IAdd) {
  const config: AxiosRequestConfig = {
    url: '/bet_record',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Edit*/
export async function apiEdit(postData: IEdit) {
  const config: AxiosRequestConfig = {
    url: '/bet_record/' + postData.id,
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Del*/
export async function apiDel(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/bet_record/' + postData.id,
    method: 'DELETE',
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Refund*/
export async function apiRefund(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/bet_record/' + postData.id + '/refund',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Restore*/
export async function apiRestore(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/bet_record/' + postData.id + '/restore',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}
