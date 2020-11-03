// import axios from 'axios';

export const LOGGED_IN = 'user/LOGGED_IN';
export const LOGGED_OUT = 'user/LOGGED_OUT';

const initialState = {
  user: {}
};

// export const loggedInThen = (data) => {
//   return { type: LOGGED_IN, userId: data.id };
// };

// export const loggedIn = (id) => {
//   return (dispatch) => {
//     return axios
//       .patch(`/api/user/${id}`, { logged_in: true })
//       .then((res) => dispatch(loggedInThen(res.data)));
//   };
// };

// export const loggedOutThen = (data) => {
//   return { type: LOGGED_OUT, userId: data.id };
// };

// export const loggedOut = (id) => {
//   return (dispatch) => {
//     return axios
//       .patch(`/api/user/${id}`, { logged_in: false })
//       .then((res) => dispatch(loggedOutThen(res.data)));
//   };
// };

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    // case LOGGED_IN:
    //   const loginUsers = { ...state.user };
    //   loginUsers[action.userId - 1] = {
    //     ...state.users[action.userId - 1],
    //     logged_in: true
    //   };
    //   return { ...state, users: loginUsers };

    // case LOGGED_OUT:
    //   const logoutUsers = [...state.users];
    //   logoutUsers[action.userId - 1] = {
    //     ...state.users[action.userId - 1],
    //     logged_in: false
    //   };
    //   return { ...state, users: logoutUsers };

    default:
      return state;
  }
}
