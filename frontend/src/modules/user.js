import Cookie from 'js.cookie';
import axios from '../apis';
// import axios from 'axios';

export const SIGN_UP_REQUEST = 'user/SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'user/SIGN_UP_FAILURE';

export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'user/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'user/LOGOUT_FAILURE';

export const REMOVE_ERROR = 'user/REMOVE_ERROR';

export const UPDATE_QUESTION_SELECT = 'user/UPDATE_QUESTION_SELECT';

export const SKIP_SELECT_QUESTIONS = 'user/SKIP_SELECT_QUESTIONS';

const initialState = {
  loginError: false,
  signUpError: {},
  user: null,
  selectQuestion: true
};

export const skipSelectQuestions = () => {
  return (dispatch) => {
    dispatch({ type: SKIP_SELECT_QUESTIONS });
  };
};

export const requestSignUp = (signUpInfo) => {
  let res;
  return async (dispatch) => {
    dispatch({ type: SIGN_UP_REQUEST });
    try {
      res = await axios.post('user/signup/', signUpInfo);
    } catch (error) {
      dispatch({
        type: SIGN_UP_FAILURE,
        error: error.response?.data
      });
    }
    dispatch({
      type: SIGN_UP_SUCCESS,
      user: res.data
    });
    dispatch(requestLogin(signUpInfo));
  };
};

export const postSelectedQuestions = (selectedQuestions, userId) => {
  return async (dispatch) => {
    await axios.patch(`user/${userId}/`, {
      question_history: JSON.stringify(selectedQuestions)
    });
    return dispatch({
      type: UPDATE_QUESTION_SELECT,
      selectedQuestions
    });
  };
};

async function getUser() {
  const userInfo = await axios.get('/user/me/');
  return userInfo.data;
}

export const requestLogin = (loginInfo) => {
  return async (dispatch) => {
    dispatch({ type: 'question/LOGIN_REQUEST' });

    let currentUser;
    try {
      // set jwt token set
      const res = await axios.post('user/token/', loginInfo);
      Cookie.set('jwt_token_refresh', res.data.refresh);
      Cookie.set('jwt_token_access', res.data.access);

      // try login
      await axios.post('user/login/', loginInfo);
      // set user info
      currentUser = await getUser();
    } catch (err) {
      dispatch(loginFailure(err));
    }

    dispatch(loginSuccess(currentUser));
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
    type: LOGIN_FAILURE,
    error
  };
};

export const logout = () => async (dispatch) => {
  // localStorage.setItem('user', null);
  dispatch({ type: 'user/LOGOUT_REQUEST' });
  try {
    await axios.get('user/logout');
  } catch (err) {
    dispatch({ type: 'user/LOGOUT_FAILURE', error: err });
  }

  dispatch({
    type: 'user/LOGOUT_SUCCESS'
  });
};

export const removeError = () => {
  return {
    type: REMOVE_ERROR
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_REQUEST:
      return {
        ...state,
        user: null,
        signUpError: false
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        user: null,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        loginError: false
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        loginError: action.error
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        loginError: false,
        selectQuestion: true
      };
    case REMOVE_ERROR:
      return {
        ...state,
        user: null,
        loginError: false
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpError: false,
        selectQuestion: false
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        signUpError: action.error
      };
    case SKIP_SELECT_QUESTIONS:
      return {
        ...state,
        selectQuestion: true
      };
    case UPDATE_QUESTION_SELECT: {
      const newUser = {
        ...state.user,
        question_history: action.selectedQuestions
      };
      return {
        ...state,
        user: newUser,
        selectQuestion: true
      };
    }
    default:
      return state;
  }
}
