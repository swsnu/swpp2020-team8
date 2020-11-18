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

const initialState = {
  anonymousPosts: [],
  friendPosts: [],
  selectedUserPosts: [],
  selectedPost: null,
  next: null
};

export const getSelectedPost = (type, postId) => async (dispatch) => {
  const postType = type.toUpperCase();
  dispatch({ type: `post/GET_SELECTED_${postType}_REQUEST` });
  let result;
  try {
    switch (type) {
      case 'article':
        result = await axios.get(`feed/articles/${postId}`);
        break;
      case 'response':
        result = await axios.get(`feed/responses/${postId}`);
        break;
      case 'question':
        result = await axios.get(`feed/questions/${postId}`);
        break;
      default:
        console.log('Wrong type of post');
        break;
    }
  } catch (err) {
    dispatch({ type: `post/GET_SELECTED_${postType}_FAILURE`, error: err });
  }
  // console.log(result.data, postId);
  dispatch({
    type: `post/GET_SELECTED_${postType}_SUCCESS`,
    selectedPost: result.data
  });
};

export const getPostsByType = (type, userId = null) => async (dispatch) => {
  const postType = type.toUpperCase();
  // let resultFeed;
  // if (postType === 'ANON') resultFeed = mockAnonymousFeed;
  // else resultFeed = mockFriendFeed;
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
  console.log(result);
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
