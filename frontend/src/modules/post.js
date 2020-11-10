// import axios from 'axios';

import { mockFriendFeed, mockPost } from '../constants';

export const GET_SELECTED_POST = 'post/GET_SELECTED_POST';
export const GET_SELECTED_POST_SUCCESS = 'post/GET_SELECTED_POST_SUCCESS';

export const GET_FRIEND_POSTS_REQUEST = 'post/GET_FRIEND_POSTS_REQUEST';
export const GET_FRIEND_POSTS_SUCCESS = 'post/GET_FRIEND_POSTS_SUCCESS';
export const GET_FRIEND_POSTS_FAILURE = 'post/GET_FRIEND_POSTS_FAILURE';

export const GET_ANON_POSTS_REQUEST = 'post/GET_ANON_POSTS_REQUEST';
export const GET_ANON_POSTS_SUCCESS = 'post/GET_ANON_POSTS_SUCCESS';
export const GET_ANON_POSTS_FAILURE = 'post/GET_ANON_POSTS_FAILURE';

export const GET_USER_POSTS_REQUEST = 'post/GET_USER_POSTS_REQUEST';
export const GET_USER_POSTS_SUCCESS = 'post/GET_USER_POSTS_SUCCESS';
export const GET_USER_POSTS_FAILURE = 'post/GET_USER_POSTS_FAILURE';

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

export const getPostsByType = (type, userId = null) => async (dispatch) => {
  const postType = type.toUpperCase();
  dispatch({ type: `post/GET_${postType}_POSTS_REQUEST` });
  // let result;
  try {
    if (userId) {
      // result = await axios.get(`feed/${userId}/`);
    } else {
      // result = await axios.get(`feed/${type}/`);
    }
  } catch (err) {
    dispatch({ type: `post/GET_${postType}_POSTS_FAILURE`, error: err });
  }
  dispatch({
    type: `post/GET_${postType}_POSTS_SUCCESS`,
    result: [...mockFriendFeed]
  });
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SELECTED_POST_SUCCESS: {
      return {
        ...state,
        selectedPost: action.selectedPost
      };
    }
    case GET_ANON_POSTS_REQUEST:
    case GET_FRIEND_POSTS_REQUEST:
    case GET_USER_POSTS_REQUEST:
      return { ...initialState };
    case GET_ANON_POSTS_SUCCESS:
      return {
        ...state,
        anonymousPosts: action.result
      };
    case GET_FRIEND_POSTS_SUCCESS:
      return {
        ...state,
        friendPosts: [...action.result]
      };
    case GET_USER_POSTS_SUCCESS:
      return {
        ...state,
        selectedUserPosts: [...action.result]
      };
    default:
      return state;
  }
}
