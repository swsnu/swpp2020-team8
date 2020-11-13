// import axios from '../apis';
import axios from 'axios';
import Cookie from 'js.cookie';

export const SIGN_UP_REQUEST = 'user/SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'user/SIGN_UP_FAILURE';
export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGOUT = 'user/LOGOUT';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';
export const REMOVE_ERROR = 'user/REMOVE_ERROR';

export const UPDATE_QUESTION_SELECT = 'user/UPDATE_QUESTION_SELECT';

const initialState = {
  loginError: false,
  signUpError: {},
  user: {
    id: 0,
    username: '',
    isLoggedIn: false,
    questionHistory: null
  }
};

export const requestSignUp = (signUpInfo) => {
  return async (dispatch) => {
    dispatch({ type: SIGN_UP_REQUEST });
    try {
      // const { data } = await axios.post('api/auth/register', signUpInfo);
      const data = await {
        code: 200,
        user: signUpInfo
      };
      if (+data.code === 200) {
        dispatch({
          type: SIGN_UP_SUCCESS,
          user: data.user
        });
      } else {
        dispatch({
          type: SIGN_UP_FAILURE,
          error: {}
        });
      }
    } catch (error) {
      dispatch({
        type: SIGN_UP_FAILURE,
        error
      });
    }
  };
};

export const postSelectedQuestions = (selectedQuestions) => {
  return async (dispatch) => {
    await axios.post('api/user/select-questions', selectedQuestions);
    return dispatch({
      type: UPDATE_QUESTION_SELECT,
      selectedQuestions
    });
  };
};

export const signUp = (signUpInfo) => {
  return {
    type: SIGN_UP_SUCCESS,
    signUpInfo
  };
};

async function getUser() {
  const info = await fetch('/api/user/me/', {
    method: 'GET',
    credentials: 'include'
  });
  const currentUser = await info.json();
  return currentUser;
}

export const requestLogin = (loginInfo) => {
  return async (dispatch) => {
    try {
      await axios.get('api/feed/friend/');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    dispatch(login());

    const csrftoken = Cookie.get('csrftoken');

    const response = await fetch('api/user/login/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      redirect: 'follow',
      body: JSON.stringify(loginInfo)
    });

    if (response.status === 200) {
      await fetch('api/user/token/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      }).then((jwtToken) =>
        jwtToken
          .json()
          .then((data) => ({
            data: data,
            status: jwtToken.status
          }))
          .then((res) => {
            Cookie.set('jwt_token_refresh', res.data.refresh);
            Cookie.set('jwt_token_access', res.data.access);
          })
      );
      const currentUser = await getUser();
      dispatch(loginSuccess(currentUser));
    } else {
      dispatch(loginFailure(response.status));
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
        loginError: action.loginError
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
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        user: action.user,
        signUpError: false
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        signUpError: action.error
      };
    case UPDATE_QUESTION_SELECT: {
      const newUser = {
        ...state.user,
        questionHistory: action.selectedQuestions
      };
      return {
        ...state,
        user: newUser
      };
    }
    default:
      return state;
  }
}
