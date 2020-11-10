// import axios from 'axios';
import { mockPost } from '../constants';

export const GET_SELECTED_POST = 'post/GET_SELECTED_POST';
export const GET_SELECTED_POST_SUCCESS = 'post/GET_SELECTED_POST_SUCCESS';

const initialState = {
  anonymousPosts: [],
  friendPosts: [],
  selectedUserPosts: [],
  selectedPost: {}
};

// export const getSelectedPost = (id) => {
//   return async (dispatch) => {
//     const { data } = await axios.get(`/api/feed/${id}`);
//     return dispatch({
//       type: GET_SELECTED_POST,
//       post: data
//     });
//   };
// };

export const getSelectedPost = () => {
  return (dispatch) => {
    dispatch(getSelectedPostSuccess(mockPost));
  };
};

export const getSelectedPostSuccess = (selectedPost) => {
  return {
    type: GET_SELECTED_POST_SUCCESS,
    selectedPost
  };
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SELECTED_POST_SUCCESS: {
      return {
        ...state,
        selectedPost: action.selectedPost
      };
    }
    default:
      return state;
  }
}
