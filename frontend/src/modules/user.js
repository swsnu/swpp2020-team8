import axios from 'axios';

export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGOUT = 'user/LOGOUT';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';
export const REMOVE_ERROR = 'user/REMOVE_ERROR';

const initialState = {
  loginError: false,
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
    } catch (e) {
      dispatch(loginFailure(e));
    }
  };
};

export const login = () => {
  return {
    type: LOGIN_REQUEST
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
    type: LOGIN_FAILURE,
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
    case LOGIN_REQUEST:
      return {
        user: null,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        user: action.user,
        loginError: false
      };
    case LOGIN_FAILURE:
      return {
        user: null,
        loginError: true
      };
    case LOGOUT:
      return {
        user: null,
        loginError: false
      };
    case REMOVE_ERROR:
      return {
        user: null,
        loginError: false
      };
    default:
      return state;
  }
}
