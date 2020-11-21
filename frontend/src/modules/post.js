/* eslint-disable camelcase */
import axios from '../apis';
import { mockPost } from '../constants';

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

export const CREATE_COMMENT_REQUEST = 'post/CREATE_COMMENT_REQUEST';
export const CREATE_COMMENT_SUCCESS = 'post/CREATE_COMMENT_SUCCESS';
export const CREATE_COMMENT_FAILURE = 'post/CREATE_COMMENT_FAILURE';

export const CREATE_REPLY_REQUEST = 'post/CREATE_REPLY_REQUEST';
export const CREATE_REPLY_SUCCESS = 'post/CREATE_REPLY_SUCCESS';
export const CREATE_REPLY_FAILURE = 'post/CREATE_REPLY_FAILURE';

const initialState = {
  anonymousPosts: [],
  friendPosts: [],
  selectedUserPosts: [],
  selectedPost: {},
  next: null
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
  let result;
  try {
    if (userId) {
      result = await axios.get(`feed/${userId}/`);
    } else {
      result =
        type === 'anon'
          ? await axios.get('feed/anonymous')
          : await axios.get(`feed/${type}/`);
    }
  } catch (err) {
    dispatch({ type: `post/GET_${postType}_POSTS_FAILURE`, error: err });
  }
  const { data } = result;
  dispatch({
    type: `post/GET_${postType}_POSTS_SUCCESS`,
    result: data.results,
    next: data.next ?? null
  });
};

export const createPost = (newPost) => async (dispatch) => {
  dispatch({
    type: CREATE_POST_REQUEST,
    newPost
  });

  const postType = `${newPost.type.toLowerCase()}s`;
  let result;
  try {
    result = await axios.post(`api/feed/${postType}/`, newPost);
  } catch (error) {
    dispatch({
      type: CREATE_POST_FAILURE,
      error
    });
  }
  dispatch({
    type: CREATE_POST_SUCCESS,
    newPost: result.data
  });
};

export const createComment = (newComment) => async (dispatch) => {
  dispatch({
    type: CREATE_COMMENT_REQUEST
  });

  let result;
  try {
    result = await axios.post(`comments/`, newComment);
  } catch (error) {
    dispatch({
      type: CREATE_COMMENT_FAILURE,
      error
    });
  }
  dispatch({
    type: CREATE_COMMENT_SUCCESS,
    result: result.data
  });
};

export const createReply = (newReply) => async (dispatch) => {
  dispatch({
    type: CREATE_REPLY_REQUEST
  });

  let result;
  try {
    result = await axios.post(`comments/`, newReply);
  } catch (error) {
    dispatch({
      type: CREATE_REPLY_FAILURE,
      error
    });
  }
  dispatch({
    type: CREATE_REPLY_SUCCESS,
    result: result.data
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
        anonymousPosts: [...action.result],
        next: action.next
      };
    case GET_FRIEND_POSTS_SUCCESS:
      return {
        ...state,
        friendPosts: [...action.result],
        next: action.next
      };
    case GET_USER_POSTS_SUCCESS:
      return {
        ...state,
        selectedUserPosts: [...action.result],
        next: action.next
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
    case CREATE_COMMENT_SUCCESS: {
      const { target_type, target_id } = action.result;
      const newFriendPosts = state.friendPosts?.map((post) => {
        if (post.id === target_id && post.type === target_type) {
          return {
            ...post,
            comments: post.comments
              ? [...post.comments, action.result]
              : [action.result]
          };
        }
        return post;
      });

      const newUserPosts = state.selectedUserPosts?.map((post) => {
        if (post.id === target_id && post.type === target_type) {
          return {
            ...post,
            comments: post.comments
              ? [...post.comments, action.result]
              : [action.result]
          };
        }
        return post;
      });

      const { selectedPost } = state;
      const newSelectedPost =
        selectedPost &&
        selectedPost.id === target_id &&
        selectedPost.type === target_type
          ? {
              ...selectedPost,
              comments: selectedPost.comments
                ? [...selectedPost.comments, action.result]
                : [action.result]
            }
          : selectedPost;

      return {
        ...state,
        friendPosts: newFriendPosts,
        selectedUserPosts: newUserPosts,
        selectedPost: newSelectedPost
      };
    }

    default:
      return state;
  }
}
