import axios from 'axios';

const instance = axios.create();
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
