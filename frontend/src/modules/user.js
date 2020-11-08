import axios from 'axios';
import { push } from 'connected-react-router';

export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';
export const GET_LOGIN = 'user/GET_LOGIN';
export const REMOVE_ERROR = 'user/REMOVE_ERROR';

const initialState = {
  user: {},
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')),
  loginError: ''
};

export const signUp = (signUpInfo) => {
  return {
    type: SIGN_UP_SUCCESS,
    signUpInfo
  };
};

export const getLoginDeep = (data) => {
  return { type: GET_LOGIN, login: data.isLoggedIn };
};

export const getLogin = () => {
  return (dispatch) => {
    return axios.get('/api/user').then((res) => {
      dispatch(getLoginDeep(res.data));
    });
  };
};

export const loginDeep = () => {
  return { type: LOGIN, isLoggedIn: true, loginError: '' };
};

export const login = (loginInfo) => {
  return (dispatch) => {
    return axios
      .post('/api/user/login/', loginInfo)
      .then(() => {
        dispatch(loginDeep());
        dispatch(push('/browse'));
      })
      .catch((err) => {
        let errMessage = '';
        switch (err.response.status) {
          case 401:
            errMessage = 'Email or Password incorrect';
            break;
          case 400:
            errMessage = 'Something went wrong with the request. Try again.';
            break;
          case 404:
            errMessage = 'Email or Password incorrect';
            break;
          default:
            break;
        }
        dispatch(loginFail(errMessage));
      });
  };
};

export const loginFail = (error) => {
  return { type: LOGIN, isLoggedIn: false, loginError: error };
};

export const logoutDeep = () => {
  return { type: LOGOUT, isLoggedIn: false };
};

export const logout = () => {
  return (dispatch) => {
    return axios.get('/api/user/logout/').then(() => {
      dispatch(logoutDeep());
      dispatch(push('/'));
    });
  };
};

export const removeError = () => {
  return { type: REMOVE_ERROR, signupErr: '', loginError: '' };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem('isLoggedIn', JSON.stringify(action.isLoggedIn));
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
        loginError: action.loginError
      };
    case GET_LOGIN:
      return { ...state, isLoggedIn: action.login };
    case LOGOUT:
      localStorage.setItem('isLoggedIn', JSON.stringify(action.isLoggedIn));
      return { ...state, isLoggedIn: false };
    case REMOVE_ERROR:
      return {
        ...state,
        loginError: action.loginError
      };
    default:
      return state;
  }
}
