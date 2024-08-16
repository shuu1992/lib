import { BaseRes } from '@api/baseRes';
import axios from '@utils/axios';
import { AxiosRequestConfig } from 'axios';
import { IUploadImgRes } from './res';
/**上傳檔案 */
export async function apiUploadImg(postData: any) {
  const config: AxiosRequestConfig = {
    url: '/upload/image',
    method: 'POST',
    data: postData,
  };
  return await axios.request<any, BaseRes<IUploadImgRes>>(config);
}
