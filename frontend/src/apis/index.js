import axios from 'axios';
// import history from '@/history';

const instance = axios.create();

instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.xsrfCookieName = 'csrftoken';
instance.defaults.xsrfHeaderName = 'X-CSRFToken';
// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // if error == unauthorized
//     // history.push('/login');
//   }
// );

export default instance;
