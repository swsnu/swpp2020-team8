import axios from 'axios';
// import history from '@/history';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});

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
