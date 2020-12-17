/* eslint-disable no-unused-vars */
import Cookies from 'js.cookie';
import history from '../history';

export default function loadingReducer(state, action) {
  if (typeof state === 'undefined') {
    return {};
  }
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);
  if (!matches) return state;
  const [, requestName, requestState] = matches;

  if (requestState === 'FAILURE') {
    if (requestName === 'user/GET_CURRENT_USER') {
      Cookies.remove('jwt_token_refresh');
      Cookies.remove('jwt_token_access');
      history.push('/login');
    }
    // TODO: error handling
    // const statusCode = error.response.status;
    // switch (statusCode) {
    //   case 500:
    //     window.alert("서버에러가 발생했습니다")
    //     break;
    //   case 401:
    //     break;
    //   case 403:
    //     break;
    //   case 404:
    //     break;
    //   default:
    //     break;
    // }
  }
  if (requestName === 'user/LOGOUT') {
    return {
      ...state,
      'user/LOGIN': 'FAILURE'
    };
  }
  return {
    ...state,
    [requestName]: requestState
  };
}
