/* eslint-disable no-param-reassign */
import axios from 'axios';
import Cookie from 'js.cookie';
// eslint-disable-next-line import/no-cycle

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true
});

instance.defaults.headers.common['Content-Type'] = 'application/json';

instance.interceptors.request.use((config) => {
  const token = Cookie.get('csrftoken');
  config.headers.Authorization = token;
  config.headers['X-CSRFToken'] = token;

  return config;
});

export default instance;
