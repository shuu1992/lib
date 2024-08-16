import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList, IInfo, IAdd, IEdit, IDel, IOddsInfo, ISetOdds } from './req';
import { IResInfo, IResOdds } from './res';
/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/game_record',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, PageRes<IResInfo[]>>(config);
}

/** Info*/
export async function apiInfo(postData: IInfo) {
  const config: AxiosRequestConfig = {
    url: '/game_record/' + postData.id,
    method: 'GET',
  };
  return await axios.request<any, BaseRes<IResInfo>>(config);
}

/** Add*/
export async function apiAdd(postData: IAdd) {
  const config: AxiosRequestConfig = {
    url: '/game_record',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Edit*/
export async function apiEdit(postData: IEdit) {
  const config: AxiosRequestConfig = {
    url: '/game_record/' + postData.id,
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Del*/
export async function apiDel(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/game_record/' + postData.id,
    method: 'DELETE',
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Refund*/
export async function apiRefund(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/game_record/' + postData.id + '/refund',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Restore*/
export async function apiRestore(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/game_record/' + postData.id + '/restore',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Payout*/
export async function apiPayout(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/game_record/' + postData.id + '/payout',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

export async function apiGetOddsList(postData: IOddsInfo) {
  const config: AxiosRequestConfig = {
    url: `/game_odds_control/betarea`,
    params: postData,
    method: 'GET',
    // data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

export async function apiSetOdd(postData: ISetOdds) {
  const config: AxiosRequestConfig = {
    url: '/game_odds_control/adjust',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<IResOdds>>(config);
}
