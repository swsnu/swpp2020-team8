export const UPDATE_SIGNUP_INFO = 'user/UPDATE_SIGNUP_INFO';

const initialState = {
  user: {},
  signUpInfo: {}
};

export const updateSignUpInfo = (signUpInfo) => {
  return {
    type: UPDATE_SIGNUP_INFO,
    signUpInfo
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SIGNUP_INFO:
      return {
        ...state,
        signUpInfo: {
          ...state.signUpInfo,
          ...action.signUpInfo
        }
      };
    default:
      return state;
  }
}
