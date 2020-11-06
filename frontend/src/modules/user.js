export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';

const initialState = {
  user: {}
};

export const signUp = (signUpInfo) => {
  return {
    type: SIGN_UP_SUCCESS,
    signUpInfo
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
