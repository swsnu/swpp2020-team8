import Cookie from 'js.cookie';
import axios from '../apis';

export const GET_CURRENT_USER_REQUEST = 'user/GET_CURRENT_USER_REQUEST';
export const GET_CURRENT_USER_SUCCESS = 'user/GET_CURRENT_USER_SUCCESS';

export const SIGN_UP_REQUEST = 'user/SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'user/SIGN_UP_FAILURE';

export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';

export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';

export const UPDATE_QUESTION_SELECT = 'user/UPDATE_QUESTION_SELECT';

export const SKIP_SELECT_QUESTIONS = 'user/SKIP_SELECT_QUESTIONS';

export const GET_SELECTED_USER_REQUEST = 'user/GET_SELECTED_USER_REQUEST';
export const GET_SELECTED_USER_SUCCESS = 'user/GET_SELECTED_USER_SUCCESS';
export const GET_SELECTED_USER_FAILURE = 'user/GET_SELECTED_USER_FAILURE';

const initialState = {
  loginError: false,
  signUpError: {},
  currentUser: null,
  selectedUser: null,
  selectQuestion: true
};

export const skipSelectQuestions = () => {
  return (dispatch) => {
    dispatch({ type: SKIP_SELECT_QUESTIONS });
  };
};

export const requestSignUp = (signUpInfo) => {
  return async (dispatch) => {
    dispatch({ type: SIGN_UP_REQUEST });
    try {
      const { data } = await axios.post('user/signup/', signUpInfo);
      if (data.id) {
        dispatch({
          type: SIGN_UP_SUCCESS,
          currentUser: data
        });
        dispatch(requestLogin(signUpInfo));
      } else {
        dispatch({
          type: SIGN_UP_FAILURE,
          error: data
        });
      }
    } catch (error) {
      dispatch({
        type: SIGN_UP_FAILURE,
        error: error.response?.data
      });
    }
  };
};

export const postSelectedQuestions = (selectedQuestions) => {
  return async (dispatch) => {
    await axios.patch(`user/me/`, {
      question_history: JSON.stringify(selectedQuestions)
    });
    return dispatch({
      type: UPDATE_QUESTION_SELECT,
      selectedQuestions
    });
  };
};

export const requestLogin = (loginInfo) => {
  return async (dispatch) => {
    dispatch({ type: 'user/LOGIN_REQUEST' });

    let currentUser;
    try {
      // set jwt token set
      const res = await axios.post('user/token/', loginInfo);
      Cookie.set('jwt_token_refresh', res.data.refresh);
      Cookie.set('jwt_token_access', res.data.access);

      // try login
      await axios.post('user/login/', loginInfo);
      // set user info
      currentUser = await getCurrentUser();
      dispatch(loginSuccess(currentUser));
    } catch (err) {
      dispatch(loginFailure(err));
      return;
    }
    dispatch(loginSuccess(currentUser));
  };
};

export const loginSuccess = (currentUser) => {
  return {
    type: LOGIN_SUCCESS,
    currentUser
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

async function getCurrentUser() {
  const userInfo = await axios.get('/user/me/');
  return userInfo.data;
}

export const getSelectedUser = (id) => async (dispatch) => {
  let result;
  dispatch({ type: `user/GET_SELECTED_USER_REQUEST` });
  try {
    result = await axios.get(`user/${id}/`);
  } catch (err) {
    dispatch({ type: `user/GET_SELECTED_USER_FAILURE`, error: err });
  }
  dispatch({
    type: `user/GET_SELECTED_USER_SUCCESS`,
    selectedUser: result?.data
  });
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SELECTED_USER_REQUEST:
      return {
        ...state,
        selectedUser: null
      };
    case GET_SELECTED_USER_SUCCESS:
      return {
        ...state,
        selectedUser: action.selectedUser
      };
    case GET_SELECTED_USER_FAILURE:
      return {
        ...state,
        selectedUser: null
      };
    case SIGN_UP_REQUEST:
      return {
        ...state,
        currentUser: null,
        signUpError: false
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        currentUser: null,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.currentUser,
        loginError: false
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        currentUser: null,
        loginError: action.error
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        loginError: false,
        selectQuestion: true
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
        ...state.currentUser,
        question_history: action.selectedQuestions
      };
      return {
        ...state,
        currentUser: newUser,
        selectQuestion: true
      };
    }
    case GET_CURRENT_USER_REQUEST:
    case GET_CURRENT_USER_SUCCESS: {
      return {
        ...state,
        currentUser: action.currentUser
      };
    }
    default:
      return state;
  }
}
