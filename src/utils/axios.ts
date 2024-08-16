import axios from 'axios';
import i18n from '@i18n/index';
import globalRouter from '@utils/globalRouter';
const axiosServices = axios.create({
  baseURL: `${window.location.origin}/api`,
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //
axiosServices.interceptors.request.use(
  (config) => {
    config.baseURL = `${config.baseURL}/${i18n.language}`;
    const token = window.localStorage.getItem('token') || '';
    if (token) {
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
    switch (error.response.status) {
      case 401:
        window.location.href = '/login';
        break;
      case 406:
        window.location.href = '/login';
        setTimeout(window.close, 1000);
        break;
    }

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
