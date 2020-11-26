import axios from '../apis';

export const LIKE_POST_REQUEST = 'like/LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'like/LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'like/LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'like/CANCEL_LIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'like/CANCEL_LIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'like/CANCEL_LIKE_POST_FAILURE';

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
  }
  dispatch({ type: LIKE_POST_SUCCESS, result: result?.data });
};

export const unlikePost = () => async (dispatch) => {
  dispatch({ type: UNLIKE_POST_REQUEST });
  // const likes = await axios.get('/likes/');
  const likeId = 1;
  try {
    await axios.delete(`/likes/${likeId}/`);
  } catch (error) {
    dispatch({ type: UNLIKE_POST_FAILURE, error });
  }
  dispatch({ type: UNLIKE_POST_SUCCESS, likeId });
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
