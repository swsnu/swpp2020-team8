/* eslint-disable camelcase */
import axios from '../apis';
// import { mockResponse, mockArticle, mockCustomQuestion } from '../constants';

export const GET_SELECTED_ARTICLE_REQUEST = 'post/GET_SELECTED_ARTICLE';
export const GET_SELECTED_ARTICLE_SUCCESS = 'post/GET_SELECTED_ARTICLE_SUCCESS';
export const GET_SELECTED_ARTICLE_FAILURE = 'post/GET_SELECTED_ARTICLE_FAILURE';

export const GET_SELECTED_RESPONSE_REQUEST = 'post/GET_SELECTED_RESPONSE';
export const GET_SELECTED_RESPONSE_SUCCESS =
  'post/GET_SELECTED_RESPONSE_SUCCESS';
export const GET_SELECTED_RESPONSE_FAILURE =
  'post/GET_SELECTED_RESPONSE_FAILURE';

export const GET_SELECTED_QUESTION_REQUEST = 'post/GET_SELECTED_QUESTION';
export const GET_SELECTED_QUESTION_SUCCESS =
  'post/GET_SELECTED_QUESTION_SUCCESS';
export const GET_SELECTED_QUESTION_FAILURE =
  'post/GET_SELECTED_QUESTION_FAILURE';

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

export const DELETE_COMMENT_REQUEST = 'post/DELETE_COMMENT_REQUEST';
export const DELETE_COMMENT_SUCCESS = 'post/DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILURE = 'post/DELETE_COMMENT_FAILURE';

export const DELETE_POST_REQUEST = 'post/DELETE_POST_REQUEST';
export const DELETE_POST_SUCCESS = 'post/DELETE_POST_SUCCESS';
export const DELETE_POST_FAILURE = 'post/DELETE_POST_FAILURE';

const initialState = {
  anonymousPosts: [],
  friendPosts: [],
  selectedUserPosts: [],
  selectedPost: null,
  next: null
};

export const getSelectedPost = (postType, id) => async (dispatch) => {
  const type = postType.toUpperCase().slice(0, -1);
  let result;
  dispatch({ type: `post/GET_SELECTED_${type}_REQUEST` });
  try {
    result = await axios.get(`feed/${postType}/${id}/`);
  } catch (err) {
    dispatch({ type: `post/GET_SELECTED_${type}_FAILURE`, error: err });
    return;
  }
  dispatch({
    type: `post/GET_SELECTED_${type}_SUCCESS`,
    selectedPost: result?.data
  });
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
  const payload = {
    ...newPost,
    share_anonymously: newPost.shareAnonymously,
    share_with_friends: newPost.shareWithFriends
  };
  let result;
  try {
    result = await axios.post(`feed/${postType}/`, payload);
  } catch (error) {
    dispatch({
      type: CREATE_POST_FAILURE,
      error
    });
  }
  let resultPost = result.data;
  if (resultPost.type === 'Question') {
    resultPost = {
      ...resultPost,
      share_anonymously: true,
      share_with_friends: true
    };
  }
  dispatch({
    type: CREATE_POST_SUCCESS,
    newPost: resultPost
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

export const createReply = (newReply, postKey) => async (dispatch) => {
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
    result: result.data,
    postKey
  });
};

export const deleteComment = (commentId, postKey, isReply) => async (
  dispatch
) => {
  dispatch({
    type: DELETE_COMMENT_REQUEST
  });

  try {
    await axios.delete(`comments/${commentId}`);
  } catch (error) {
    dispatch({
      type: DELETE_COMMENT_FAILURE,
      error
    });
  }
  dispatch({
    type: DELETE_COMMENT_SUCCESS,
    commentId,
    isReply,
    postKey
  });
};

export const deletePost = (postId, type) => async (dispatch) => {
  const postType = type.toLowerCase();
  try {
    await axios.delete(`feed/${postType}s/${postId}`);
  } catch (error) {
    dispatch({ type: DELETE_POST_FAILURE });
    return;
  }
  dispatch({ type: DELETE_POST_SUCCESS, postId, postType: type });
};

const getNewCommentsWithReply = (comments, reply) => {
  const newComments = comments?.map((comment) => {
    if (comment.id === reply.target_id) {
      return {
        ...comment,
        replies: comment.replies ? [...comment.replies, reply] : [reply]
      };
    }
    return comment;
  });

  return newComments;
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SELECTED_ARTICLE_REQUEST:
    case GET_SELECTED_RESPONSE_REQUEST:
    case GET_SELECTED_QUESTION_REQUEST:
      return { ...initialState };
    case GET_SELECTED_ARTICLE_SUCCESS:
    case GET_SELECTED_RESPONSE_SUCCESS:
    case GET_SELECTED_QUESTION_SUCCESS: {
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
      const newFriendPosts = newPost.share_with_friends
        ? [newPost, ...state.friendPosts]
        : state.friendPosts;
      const newAnonPosts = newPost.share_anonymously
        ? [newPost, ...state.anonymousPosts]
        : state.anonymousPosts;
      return {
        ...state,
        anonymousPosts: newAnonPosts,
        friendPosts: newFriendPosts
      };
    }
    case DELETE_POST_SUCCESS: {
      const postKey = `${action.postType}-${action.postId}`;
      const newFriendPosts = state.friendPosts.filter((post) => {
        const key = `${post.type}-${post.id}`;
        return key !== postKey;
      });
      return {
        ...state,
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
    case CREATE_REPLY_SUCCESS: {
      const reply = action.result;
      const targetPost = state.friendPosts.find((post) => {
        const key = `${post.type}-${post.id}`;
        return key === action.postKey;
      });

      let newComments = getNewCommentsWithReply(targetPost?.comments, reply);
      const newFriendPosts = state.friendPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey) {
          return { ...post, comments: newComments };
        }
        return post;
      });

      const newUserPosts = state.selectedUserPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey) {
          return { ...post, comments: newComments };
        }
        return post;
      });

      const selectedPostKey = `${state.selectedPost?.type}-${state.selectedPost?.id}`;
      newComments = getNewCommentsWithReply(
        state.selectedPost?.comments,
        reply
      );

      const newSelectedPost =
        selectedPostKey === action.postKey
          ? { ...state.selectedPost, comments: newComments }
          : state.selectedPost;

      return {
        ...state,
        selectedUserPosts: newUserPosts,
        selectedPost: newSelectedPost,
        friendPosts: newFriendPosts
      };
    }

    case DELETE_COMMENT_SUCCESS: {
      const targetPost = state.friendPosts.find((post) => {
        const key = `${post.type}-${post.id}`;
        return key === action.postKey;
      });

      const getCommentsAfterDelete = (comments) => {
        return comments
          ?.filter((comment) => comment.id !== action.commentId)
          .map((comment) => {
            const newReplies = comment.replies?.filter(
              (item) => item.id !== action.commentId
            );
            return {
              ...comment,
              replies: newReplies
            };
          });
      };
      const newComments = getCommentsAfterDelete(targetPost?.comments);

      const newFriendPosts = state.friendPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey) {
          return { ...post, comments: newComments };
        }
        return post;
      });

      const newUserPosts = state.selectedUserPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey) {
          return { ...post, comments: newComments };
        }
        return post;
      });

      const selectedPostKey = `${state.selectedPost?.type}-${state.selectedPost?.id}`;

      const newSelectedPost =
        selectedPostKey === action.postKey
          ? {
              ...state.selectedPost,
              comments: getCommentsAfterDelete(state.selectedPost?.comments)
            }
          : state.selectedPost;

      return {
        ...state,
        friendPosts: newFriendPosts,
        selectedPost: newSelectedPost,
        selectedUserPosts: newUserPosts
      };
    }

    default:
      return state;
  }
}
