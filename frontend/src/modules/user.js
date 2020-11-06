import axios from 'axios';
import { push } from 'connected-react-router';

export const LOGIN = 'user/LOGIN';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'user/LOGIN_ERROR';
export const LOGOUT = 'user/LOGOUT';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';

const initialState = {
  user: {
    email: '',
    username: '',
    loginFailed: false
  },
  loggedIn: false
};

export const signUp = (signUpInfo) => {
  return {
    type: SIGN_UP_SUCCESS,
    signUpInfo
  };
};

export const login = () => {
  return {
    type: LOGIN
  };
};

export const loginFailure = () => {
  return {
    type: LOGIN_ERROR
  };
};

export const requestLogin = (email, password) => {
  return (dispatch) => {
    try {
      const { data } = axios.post('/user/login', email, password);
      if (+data.code === 200) {
        dispatch(login());
        dispatch(push('/friends'));
      } else {
        dispatch(loginFailure(data.error));
      }
    } catch (error) {
      dispatch(loginFailure());
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

export const requestLogout = () => {
  return (dispatch) => {
    axios.get('/user/logout');
    dispatch(logout());
    dispatch(push('/login'));
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          failed: false
        },
        loggedIn: true
      };

    case LOGIN_ERROR:
      return {
        ...state,
        user: {
          ...state.user,
          failed: true
        },
        loggedIn: false
      };

    case LOGOUT:
      return {
        ...state,
        user: initialState.user,
        loggedIn: false
      };

    default:
      return state;
  }
}
