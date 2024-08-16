import axios from 'axios';
import i18n from '@i18n/index';
const axiosServices = axios.create({
  baseURL: `${window.location.origin}/api`,
});
import { useAuthStore } from '@store/useAuthStore';
// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //
axiosServices.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    config.baseURL = `${config.baseURL}/${i18n.language}`;
    const user = window.localStorage.getItem(`${import.meta.env.VITE_HTML_TITLE}-user`);
    const userData = JSON.parse(user as string);
    if (userData) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
axiosServices.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (response.headers['authorization']) {
      window.localStorage.setItem('token', response.headers['authorization'].replace('Bearer', ''));
    }
    return data;
  },
  (error) => {
    const { data } = error.response;

    if (data.errors !== undefined && Object.keys(data.errors).length > 0) {
      let msg = '';
      const key = Object.keys(data.errors)[0];
      msg = data.errors[key][0];
      error.response.data.message = `${key} ${msg}`;
    }
    return Promise.reject(error.response?.data);
  },
);

export default axiosServices;
