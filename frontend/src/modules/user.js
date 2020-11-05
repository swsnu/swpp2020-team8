import axios from 'axios';

export const LOGIN = 'user/LOGIN';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'user/LOGIN_ERROR';
export const LOGOUT = 'user/LOGOUT';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';

const initialState = {
  user: {},
  error: false
};

export const login = () => {
  return {
    type: LOGIN
  };
};

export const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_ERROR,
    error
  };
};

export const requestLogin = (email, password) => {
  return (dispatch) => {
    dispatch(login());
    try {
      const { data } = axios.post('/user/login', email, password);
      if (+data.code === 200) {
        dispatch(loginSuccess(data.user));
      } else {
        dispatch(loginFailure(data.error));
      }
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };
};

export const signUp = (signUpInfo) => {
  return {
    type: SIGN_UP_SUCCESS,
    signUpInfo
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        user: {},
        error: false
      };
    case LOGIN_SUCCESS:
      return {
        user: { ...action.user },
        error: false
      };
    case LOGIN_ERROR:
      return {
        user: {},
        error: action.error
      };
    case LOGOUT:
      return {
        user: {},
        error: false
      };
    default:
      return state;
  }
}
