import Cookies from 'js.cookie';
import history from '../history';

export default function loadingReducer(state = {}, action) {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);
  if (!matches) return state;
  const [, requestName, requestState] = matches;

  if (requestState === 'FAILURE') {
    Cookies.remove('jwt_token_refresh');
    Cookies.remove('jwt_token_access');
    history.push('/login');
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
