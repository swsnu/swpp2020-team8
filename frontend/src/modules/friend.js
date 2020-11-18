// import axios from '../apis';
import { mockFriendList } from '../constants';

const initialState = {
  friendList: [],
  selectedUser: {},
  selectedUserResults: []
};

export const GET_FRIEND_LIST_REQUEST = 'friend/GET_FRIEND_LIST_REQUEST';
export const GET_FRIEND_LIST_SUCCESS = 'friend/GET_FRIEND_LIST_SUCCESS';
export const GET_FRIEND_LIST_FAILURE = 'friend/GET_FRIEND_LIST_FAILURE';

export const getFriendList = () => async (dispatch, getState) => {
  const userId = getState().userReducer.user?.id;
  dispatch({ type: GET_FRIEND_LIST_REQUEST });
  let result;
  if (!userId) return;
  try {
    // result = await axios.get(`user/${userId}/friends/`);
    result = await {
      data: {
        count: 4,
        results: mockFriendList
      }
    };
  } catch (err) {
    dispatch({ type: GET_FRIEND_LIST_FAILURE, error: err });
  }
  const { data } = result;
  dispatch({
    type: GET_FRIEND_LIST_SUCCESS,
    result: data.results
  });
};

export default function friendReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FRIEND_LIST_REQUEST:
    case GET_FRIEND_LIST_FAILURE:
      return {
        ...state,
        friendList: []
      };
    case GET_FRIEND_LIST_SUCCESS:
      return {
        ...state,
        friendList: action.result
      };
    default:
      return state;
  }
}
