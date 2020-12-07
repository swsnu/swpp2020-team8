/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import Cookies from 'js.cookie';
// eslint-disable-next-line import/no-cycle

const developBaseUrl = 'http://localhost:3000/api/';
const prodBaseUrl = 'https://adoor.world/api/';

const instance = axios.create({
  // baseURL: '/api/',
  baseURL: developBaseUrl,
  withCredentials: true
});

instance.defaults.headers.common['Content-Type'] = 'application/json';

instance.interceptors.request.use((config) => {
  const csrf_token = Cookies.get('csrftoken');
  const jwt_token = Cookies.get('jwt_token_access');

  config.headers.Authorization = jwt_token;
  config.headers['X-CSRFToken'] = csrf_token;

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    const refresh_token = Cookies.get('jwt_token_refresh');
    // TODO: 404 error handling
    // if (error.response.status === 404) window.location.href = '/';
    // else if (error.response.status === 401 && refresh_token) {
    if (error.response.status === 401 && refresh_token) {
      return instance
        .post('user/token/refresh/', { refresh: refresh_token })
        .then((response) => {
          Cookies.set('jwt_token_refresh', response.data.refresh);
          Cookies.set('jwt_token_access', response.data.access);

          instance.defaults.headers.Authorization = `${response.data.access}`;
          originalRequest.headers.Authorization = `${response.data.access}`;

          instance.get('user/me/');

          return instance(originalRequest);
        })
        .catch((err, dispatch) => {
          dispatch({ type: 'user/LOGIN_FAILURE', error: err });
        });
    }
    return Promise.reject(error);
  }
);
export default instance;
