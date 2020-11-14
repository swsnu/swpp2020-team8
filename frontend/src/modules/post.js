// import axios from '../apis';

import { mockFriendFeed, mockAnonymousFeed, mockPost } from '../constants';

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

export const CREATE_POST_REQUEST = 'post/CREATE_POST_REQUEST';
export const CREATE_POST_SUCCESS = 'post/CREATE_POST_SUCCESS';
export const CREATE_POST_FAILURE = 'post/CREATE_POST_FAILURE';

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
  let resultFeed;
  if (postType === 'ANON') resultFeed = mockAnonymousFeed;
  else resultFeed = mockFriendFeed;
  dispatch({ type: `post/GET_${postType}_POSTS_REQUEST` });
  // let result;
  try {
    if (userId) {
      // result = await axios.get(`feed/${userId}/`);
    } else {
      // const result = await axios.get(`api/feed/${type}/`);
      // console.log(result);
    }
  } catch (err) {
    dispatch({ type: `post/GET_${postType}_POSTS_FAILURE`, error: err });
  }
  dispatch({
    type: `post/GET_${postType}_POSTS_SUCCESS`,
    result: [...resultFeed]
  });
};

export const createPost = (newPost) => async (dispatch) => {
  dispatch({
    type: CREATE_POST_REQUEST,
    newPost
  });

  // const postType = `${newPost.type.toLowerCase()}s`;
  const mockAuthor = {
    id: 13,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  };
  // let result;
  try {
    // await axios.post(`api/feed/${postType}/`, newPost);
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    dispatch({
      type: CREATE_POST_FAILURE,
      error
    });
  }
  dispatch({
    type: CREATE_POST_SUCCESS,
    newPost: { ...newPost, author_detail: mockAuthor }
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
        anonymousPosts: [...action.result]
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
    case CREATE_POST_REQUEST:
    case CREATE_POST_FAILURE:
      return { ...state };
    case CREATE_POST_SUCCESS: {
      const { newPost } = action;
      const newFriendPosts = newPost.shareWithFriends
        ? [newPost, ...state.friendPosts]
        : state.friendPosts;
      const newAnonPosts = newPost.shareAnonymously
        ? [newPost, ...state.anonymousPosts]
        : state.anonymousPosts;
      return {
        ...state,
        anonymousPosts: newAnonPosts,
        friendPosts: newFriendPosts
      };
    }

    default:
      return state;
  }
}
