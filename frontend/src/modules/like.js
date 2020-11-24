// import axios from '../apis';

export const LIKE_POST_REQUEST = 'like/LIKE_POST';
export const LIKE_POST_SUCCESS = 'like/LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'like/LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'like/CANCEL_LIKE_POST';
export const UNLIKE_POST_SUCCESS = 'like/CANCEL_LIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'like/CANCEL_LIKE_POST_FAILURE';

const initialState = {
  likedPosts: [],
  likeError: false
};

export default function likeReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
