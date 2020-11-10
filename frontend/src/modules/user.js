import axios from 'axios';

export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'user/LOGIN_ERROR';
export const REMOVE_ERROR = 'user/REMOVE_ERROR';

const initialState = {
  error: false,
  user: {
    id: 0,
    username: '',
    isLoggedIn: false
  }
};

export const signUp = (signUpInfo) => {
  return {
    type: SIGN_UP_SUCCESS,
    signUpInfo
  };
};

export const requestLogin = (email, password) => {
  return async (dispatch) => {
    dispatch(login());
    try {
      const { data } = await axios.post('/api/user/login', email, password);
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

export const login = () => {
  return {
    type: LOGIN
  };
};

export const loginSuccess = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
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

export const logout = () => {
  localStorage.setItem('user', null);
  return {
    type: LOGOUT
  };
};

export const logoutSuccess = (user) => {
  return {
    type: LOGOUT,
    user
  };
};

export const removeError = () => {
  return {
    type: REMOVE_ERROR
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        user: null,
        error: false
      };
    case LOGIN_SUCCESS:
      return {
        user: action.user,
        error: false
      };
    case LOGIN_ERROR:
      return {
        user: null,
        error: action.error
      };
    case LOGOUT:
      return {
        user: null,
        error: false
      };
    case REMOVE_ERROR:
      return {
        user: null,
        error: false
      };
    default:
      return state;
  }
}
