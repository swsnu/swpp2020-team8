import axios from '../apis';

const initialState = {
  friendList: [],
  selectedUser: {},
  selectedUserPosts: [],
  friendRequestError: false
};

export const GET_FRIEND_LIST_REQUEST = 'friend/GET_FRIEND_LIST_REQUEST';
export const GET_FRIEND_LIST_SUCCESS = 'friend/GET_FRIEND_LIST_SUCCESS';
export const GET_FRIEND_LIST_FAILURE = 'friend/GET_FRIEND_LIST_FAILURE';

export const REQUEST_FRIEND_REQUEST = 'friend/REQUEST_FRIEND_REQUEST';
export const REQUEST_FRIEND_SUCCESS = 'friend/REQUEST_FRIEND_SUCCESS';
export const REQUEST_FRIEND_FAILURE = 'friend/REQUEST_FRIEND_FAILURE';

export const DELETE_FRIEND_REQUEST = 'friend/DELETE_FRIEND_REQUEST';
export const DELETE_FRIEND_SUCCESS = 'friend/DELETE_FRIEND_SUCCESS';
export const DELETE_FRIEND_FAILURE = 'friend/DELETE_FRIEND_FAILURE';

export const DELETE_REQUEST_REQUEST = 'friend/DELETE_REQUEST_REQUEST';
export const DELETE_REQUEST_SUCCESS = 'friend/DELETE_REQUEST_SUCCESS';
export const DELETE_REQUEST_FAILURE = 'friend/DELETE_REQUEST_FAILURE';

export const ACCEPT_FRIEND_REQUEST = 'friend/ACCEPT_FRIEND_REQUEST';
export const REJECT_FRIEND_REQUEST = 'friend/REJECT_FRIEND_REQUEST';

export const getFriendList = () => async (dispatch) => {
  dispatch({ type: GET_FRIEND_LIST_REQUEST });
  let result;
  try {
    result = await axios.get(`user/me/friends/`);
  } catch (err) {
    dispatch({ type: GET_FRIEND_LIST_FAILURE, error: err });
    return;
  }
  dispatch({
    type: GET_FRIEND_LIST_SUCCESS,
    result: result?.data.results
  });
};

export const deleteFriend = (friendId) => async (dispatch, getState) => {
  const userId = getState().userReducer.currentUser?.id;
  dispatch({ type: DELETE_FRIEND_REQUEST, userId });
  try {
    await axios.delete(`user/friend/${friendId}/`);
  } catch (err) {
    dispatch({ type: DELETE_FRIEND_FAILURE, error: err });
    return;
  }
  dispatch({
    type: DELETE_FRIEND_SUCCESS,
    friendId
  });
};

export const deleteFriendRequest = (friendId) => async (dispatch) => {
  dispatch({ type: DELETE_REQUEST_REQUEST });
  try {
    await axios.delete(`user/friend-requests/${friendId}/`);
  } catch (err) {
    dispatch({ type: DELETE_REQUEST_FAILURE, error: err });
    return;
  }
  dispatch({
    type: DELETE_REQUEST_SUCCESS,
    friendId
  });
};

export const requestFriend = (responderId) => async (dispatch, getState) => {
  const userId = getState().userReducer.currentUser?.id;
  dispatch({
    type: REQUEST_FRIEND_REQUEST
  });
  await axios.post('user/friend-requests/', {
    requestee_id: responderId,
    requester_id: userId,
    accepted: null
  });

  dispatch({
    type: REQUEST_FRIEND_SUCCESS,
    responderId
  });
};

export const acceptFriendRequest = (friendId) => async (dispatch) => {
  dispatch({
    type: ACCEPT_FRIEND_REQUEST
  });
  await axios.patch(`user/friend-requests/${friendId}/respond/`, {
    accepted: true
  });
  dispatch(getFriendList());
};

export const rejectFriendRequest = (friendId) => async (dispatch) => {
  dispatch({
    type: REJECT_FRIEND_REQUEST
  });
  await axios.patch(`user/friend-requests/${friendId}/respond/`, {
    accepted: false
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
    case DELETE_FRIEND_SUCCESS:
      const newFriendList = state.friendList.filter(
        (friend) => friend.id !== action.friendId
      );
      return {
        ...state,
        friendList: newFriendList
      };
    case REQUEST_FRIEND_FAILURE:
      return {
        ...state,
        friendRequestError: action.error
      };
    default:
      return state;
  }
}
