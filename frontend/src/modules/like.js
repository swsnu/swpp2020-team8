import axios from '../apis';

export const LIKE_POST_REQUEST = 'like/LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'like/LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'like/LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'like/UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'like/UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'like/UNLIKE_POST_FAILURE';

const initialState = {
  likeError: false
};

export const likePost = (postInfo) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  let result;
  try {
    result = await axios.post(`/likes/`, postInfo);
  } catch (error) {
    dispatch({ type: LIKE_POST_FAILURE, error });
    return;
  }
  dispatch({ type: LIKE_POST_SUCCESS, result: result?.data });
};

export const unlikePost = (postInfo) => async (dispatch) => {
  dispatch({ type: UNLIKE_POST_REQUEST });
  const { data } = await axios.get('/likes/');
  const postId = postInfo.target_id;
  const postType = postInfo.target_type;
  let likeId;
  data.results.filter((like) => {
    if (like.target_id === postId && like.target_type === postType) {
      likeId = like.id;
    }
    return likeId;
  });
  try {
    await axios.delete(`/likes/${likeId}/`);
  } catch (error) {
    dispatch({ type: UNLIKE_POST_FAILURE, error });
    return;
  }
  dispatch({ type: UNLIKE_POST_SUCCESS, postInfo });
};

export default function likeReducer(state = initialState, action) {
  switch (action.type) {
    case LIKE_POST_REQUEST:
    case LIKE_POST_SUCCESS:
    case UNLIKE_POST_REQUEST:
    case UNLIKE_POST_SUCCESS:
      return {
        ...state,
        likeError: false
      };
    case UNLIKE_POST_FAILURE:
    case LIKE_POST_FAILURE:
      return {
        ...state,
        likeError: action.error
      };
    default:
      return state;
  }
}
