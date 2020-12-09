/* eslint-disable camelcase */
import axios from '../apis';
import { getResponsesByQuestionWithType } from './question';

export const APPEND_POSTS_REQUEST = 'post/APPEND_POSTS_REQUEST';
export const APPEND_POSTS_SUCCESS = 'post/APPEND_POSTS_SUCCESS';
export const APPEND_POSTS_FAILURE = 'post/APPEND_POSTS_FAILURE';

export const GET_SELECTED_ARTICLE_REQUEST = 'post/GET_SELECTED_ARTICLE';
export const GET_SELECTED_ARTICLE_SUCCESS = 'post/GET_SELECTED_ARTICLE_SUCCESS';
export const GET_SELECTED_ARTICLE_FAILURE = 'post/GET_SELECTED_ARTICLE_FAILURE';

export const GET_SELECTED_RESPONSE_REQUEST = 'post/GET_SELECTED_RESPONSE';
export const GET_SELECTED_RESPONSE_SUCCESS =
  'post/GET_SELECTED_RESPONSE_SUCCESS';
export const GET_SELECTED_RESPONSE_FAILURE =
  'post/GET_SELECTED_RESPONSE_FAILURE';

export const EDIT_SELECTED_RESPONSE_REQUEST =
  'post/EDIT_SELECTED_RESPONSE_REQUEST';
export const EDIT_SELECTED_RESPONSE_SUCCESS =
  'post/EDIT_SELECTED_RESPONSE_SUCCESS';
export const EDIT_SELECTED_RESPONSE_FAILURE =
  'post/EDIT_SELECTED_RESPONSE_FAILURE';

export const EDIT_SELECTED_ARTICLE_REQUEST =
  'post/EDIT_SELECTED_ARTICLE_REQUEST';
export const EDIT_SELECTED_ARTICLE_SUCCESS =
  'post/EDIT_SELECTED_ARTICLE_SUCCESS';
export const EDIT_SELECTED_ARTICLE_FAILURE =
  'post/EDIT_SELECTED_ARTICLE_FAILURE';

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
  selectedUserId: null,
  selectedPost: null,
  selectedPostFailure: false,
  next: null
};

export const appendPosts = (origin) => async (dispatch, getState) => {
  const { next } = getState().postReducer;
  if (!next) return;
  const nextUrl = next.replace('http://localhost:8000/api/', '');
  let result;
  dispatch({ type: APPEND_POSTS_REQUEST });
  try {
    result = await axios.get(nextUrl);
  } catch (error) {
    dispatch({ type: APPEND_POSTS_FAILURE, error });
    return;
  }
  const { data } = result;
  dispatch({
    type: APPEND_POSTS_SUCCESS,
    posts: data.results,
    next: data.next,
    origin
  });
};

export const getSelectedPost = (postType, id) => async (dispatch) => {
  const type = postType.toUpperCase().slice(0, -1);
  const apiType = postType.toLowerCase();
  let result;
  dispatch({ type: `post/GET_SELECTED_${type}_REQUEST` });
  try {
    result = await axios.get(`feed/${apiType}/${id}/`);
  } catch (error) {
    dispatch({
      type: `post/GET_SELECTED_${type}_FAILURE`,
      error: error.response.status
    });
    return;
  }
  dispatch({
    type: `post/GET_SELECTED_${type}_SUCCESS`,
    selectedPost: result?.data
  });
};

export const editSelectedPost = (postObj) => async (dispatch) => {
  // eslint-disable-next-line camelcase
  const { type, content, share_with_friends, share_anonymously } = postObj;
  const actionType = type.toUpperCase();
  const apiType = `${type.toLowerCase()}s`;
  let result;
  dispatch({ type: `post/EDIT_SELECTED_${actionType}_REQUEST` });
  try {
    result = await axios.patch(`feed/${apiType}/${postObj.id}/`, {
      content,
      share_with_friends,
      share_anonymously
    });
  } catch (error) {
    dispatch({ type: `post/EDIT_SELECTED_${actionType}_FAILURE`, error });
    return;
  }
  dispatch({
    type: `post/EDIT_SELECTED_${actionType}_SUCCESS`,
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
          ? await axios.get('feed/anonymous/')
          : await axios.get(`feed/${type}/`);
    }
  } catch (error) {
    dispatch({ type: `post/GET_${postType}_POSTS_FAILURE`, error });
    return;
  }
  const { data } = result;
  dispatch({
    type: `post/GET_${postType}_POSTS_SUCCESS`,
    result: data.results,
    next: data.next ?? null
  });
};

export const getSelectedUserPosts = (userId) => async (dispatch) => {
  let result;
  dispatch({ type: `post/GET_USER_POSTS_REQUEST`, userId });
  try {
    result = await axios.get(`feed/user/${userId}/`);
  } catch (error) {
    dispatch({ type: `post/GET_USER_POSTS_FAILURE`, error });
    return;
  }
  const { data } = result;
  dispatch({
    type: `post/GET_USER_POSTS_SUCCESS`,
    result: data.results,
    next: data.next ?? null
  });
};

export const createPost = (newPost) => async (dispatch, getState) => {
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
    return;
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

  if (
    resultPost.type === 'Question' &&
    !window.location.pathname.includes('home')
  ) {
    window.location = '/home';
  }

  window.scrollTo(0, 0);

  const { selectedQuestion } = getState().questionReducer;
  if (
    resultPost.type === 'Response' &&
    selectedQuestion?.id === resultPost.question_id
  ) {
    dispatch(getResponsesByQuestionWithType(selectedQuestion?.id, 'friend'));
  }
  const { selectedUserId } = getState().postReducer;
  if (+selectedUserId === +resultPost.author_detail?.id) {
    dispatch(getSelectedUserPosts(selectedUserId));
  }
};

export const createComment = (newComment, postKey, targetId) => async (
  dispatch,
  getState
) => {
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
    return;
  }
  dispatch({
    type: CREATE_COMMENT_SUCCESS,
    result: result.data,
    postKey
  });
  const { selectedQuestion } = getState().questionReducer;
  if (+selectedQuestion?.id === +targetId) {
    dispatch(getResponsesByQuestionWithType(selectedQuestion?.id, 'friend'));
  }
};

export const createReply = (newReply, postKey, targetId) => async (
  dispatch,
  getState
) => {
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
    return;
  }
  dispatch({
    type: CREATE_REPLY_SUCCESS,
    result: result.data,
    postKey
  });
  const { selectedQuestion } = getState().questionReducer;
  if (+selectedQuestion?.id === +targetId) {
    dispatch(getResponsesByQuestionWithType(selectedQuestion?.id, 'friend'));
  }
};

export const deleteComment = (commentId, postKey, isReply, targetId) => async (
  dispatch,
  getState
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
    return;
  }
  dispatch({
    type: DELETE_COMMENT_SUCCESS,
    commentId,
    isReply,
    postKey
  });
  const { selectedQuestion } = getState().questionReducer;
  if (+selectedQuestion?.id === +targetId) {
    dispatch(getResponsesByQuestionWithType(selectedQuestion?.id, 'friend'));
  }
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
      return { ...initialState, selectedPostFailure: false };
    case GET_SELECTED_ARTICLE_SUCCESS:
    case GET_SELECTED_RESPONSE_SUCCESS:
      return {
        ...state,
        selectedPost: action.selectedPost,
        selectedPostFailure: false
      };
    case GET_SELECTED_ARTICLE_FAILURE:
    case GET_SELECTED_RESPONSE_FAILURE:
      return {
        ...state,
        selectedPost: null,
        selectedPostFailure: true
      };
    case GET_ANON_POSTS_REQUEST:
    case GET_FRIEND_POSTS_REQUEST:
    case GET_USER_POSTS_REQUEST:
      return { ...initialState, selectedUserId: action.userId };
    case APPEND_POSTS_REQUEST:
      return {
        ...state,
        next: null
      };
    case APPEND_POSTS_SUCCESS:
      const appendedResult = [
        ...state[`${action.origin}Posts`],
        ...action.posts
      ];
      return {
        ...state,
        [`${action.origin}Posts`]: appendedResult,
        next: action.next
      };
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
      const newFriendPosts = [newPost, ...state.friendPosts];
      const newAnonPosts = newPost.share_anonymously
        ? [newPost, ...state.anonymousPosts]
        : state.anonymousPosts;
      return {
        ...state,
        anonymousPosts: newAnonPosts,
        friendPosts: newFriendPosts
      };
    }
    case EDIT_SELECTED_ARTICLE_SUCCESS:
      return {
        ...state,
        selectedPost: action.selectedPost
      };
    case EDIT_SELECTED_RESPONSE_SUCCESS:
      return {
        ...state,
        selectedPost: action.selectedPost
      };
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
      const newFriendPosts = state.friendPosts?.map((post) => {
        if (`${post.type}-${post.id}` === action.postKey) {
          return {
            ...post,
            comments: post.comments
              ? [...post.comments, action.result]
              : [action.result]
          };
        }
        return post;
      });

      const newAnonPosts = state.anonymousPosts?.map((post) => {
        if (
          `${post.type}-${post.id}` === action.postKey &&
          action.result?.is_anonymous
        ) {
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
        if (`${post.type}-${post.id}` === action.postKey) {
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
        `${selectedPost.type}-${selectedPost.id}` === action.postKey
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
        anonymousPosts: newAnonPosts,
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

      const targetAnonPost = state.anonymousPosts.find((post) => {
        const key = `${post.type}-${post.id}`;
        return key === action.postKey;
      });

      newComments = getNewCommentsWithReply(targetAnonPost?.comments, reply);

      const newAnonPosts = state.anonymousPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey && reply.is_anonymous) {
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
        anonymousPosts: newAnonPosts,
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

      const targetAnonPost = state.anonymousPosts.find((post) => {
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
      const newAnonComments = getCommentsAfterDelete(targetAnonPost?.comments);

      const newFriendPosts = state.friendPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey) {
          return { ...post, comments: newComments };
        }
        return post;
      });

      const newAnonPosts = state.anonymousPosts.map((post) => {
        const key = `${post.type}-${post.id}`;
        if (key === action.postKey) {
          return { ...post, comments: newAnonComments };
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
        anonymousPosts: newAnonPosts,
        selectedPost: newSelectedPost,
        selectedUserPosts: newUserPosts
      };
    }

    default:
      return state;
  }
}
