import axios from 'axios';
import Cookie from 'js.cookie';

const csrftoken = Cookie.get('csrftoken');

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true
});

instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.common['X-CSRFToken'] = csrftoken;

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
