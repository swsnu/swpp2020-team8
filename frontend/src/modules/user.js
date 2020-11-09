import axios from 'axios';

export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'user/LOGIN_ERROR';
export const REMOVE_ERROR = 'user/REMOVE_ERROR';

const initialState = {
  loading: false,
  error: false,
  user: {
    email: '',
    password: '',
    username: ''
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
      const { data } = await axios.post('/user/login', email, password);
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

export const loginSuccess = ({ user, users }) => {
  localStorage.setItem('user', JSON.stringify(user));
  return {
    type: LOGIN_SUCCESS,
    user,
    users
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_ERROR,
    error
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
        error: false,
        loading: true
      };
    case LOGIN_SUCCESS:
      return {
        user: action.user,
        error: false,
        loading: false
      };
    case LOGIN_ERROR:
      return {
        user: null,
        error: action.error,
        loading: false
      };
    case LOGOUT:
      return {
        user: null,
        error: false,
        loading: false
      };
    case REMOVE_ERROR:
      return {
        user: null,
        error: false,
        loading: false
      };
    default:
      return state;
  }
}
