import { omitBy } from 'lodash';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { PageRes, BaseRes } from '@api/baseRes';
import { IList, IInfo, IAdd, IEdit, IDel, ISCredit, IRecycle, IChangeAgent } from './req';
import { IAgPageRes, IResInfo, IResTree, IResTreeRes } from './res';

/** List*/
export async function apiList(postData: IList) {
  const config: AxiosRequestConfig = {
    url: '/agent',
    method: 'GET',
    params: omitBy(postData, (v: any) => v === ''),
  };
  return await axios.request<any, IAgPageRes<IResInfo[]>>(config);
}

/** Info*/
export async function apiInfo(postData: IInfo) {
  const config: AxiosRequestConfig = {
    url: '/agent/' + postData.id,
    method: 'GET',
  };
  return await axios.request<any, BaseRes<IResInfo>>(config);
}

/** Add*/
export async function apiAdd(postData: IAdd) {
  const config: AxiosRequestConfig = {
    url: '/agent',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Edit*/
export async function apiEdit(postData: IEdit) {
  const config: AxiosRequestConfig = {
    url: '/agent/' + postData.id,
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Del*/
export async function apiDel(postData: IDel) {
  const config: AxiosRequestConfig = {
    url: '/agent/' + postData.id,
    method: 'DELETE',
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** Storage Money*/
export async function apiStorageCredit(postData: ISCredit) {
  const config: AxiosRequestConfig = {
    url: '/agent/' + postData.id + '/credit',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** 樹狀圖*/
export async function apiTreeView() {
  const config: AxiosRequestConfig = {
    url: '/agent_sidebar',
    method: 'GET',
  };
  return await axios.request<any, IResTreeRes<IResTree[]>>(config);
}
/** Recycle Money*/
export async function apiRecycle(postData: IRecycle) {
  const config: AxiosRequestConfig = {
    url: '/agent/' + postData.id + '/retract',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}

/** 切換代理*/
export async function apiChangeAg(postData: IChangeAgent) {
  const config: AxiosRequestConfig = {
    url: '/agent/' + postData.id + '/change',
    method: 'PUT',
    data: postData,
  };
  return await axios.request<any, BaseRes<[]>>(config);
}
