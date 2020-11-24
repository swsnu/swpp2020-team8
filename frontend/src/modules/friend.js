// import axios from '../apis';
import { mockFriendList } from '../constants';

const initialState = {
  friendList: [],
  selectedUser: {},
  selectedUserPosts: []
};

export const GET_FRIEND_LIST_REQUEST = 'friend/GET_FRIEND_LIST_REQUEST';
export const GET_FRIEND_LIST_SUCCESS = 'friend/GET_FRIEND_LIST_SUCCESS';
export const GET_FRIEND_LIST_FAILURE = 'friend/GET_FRIEND_LIST_FAILURE';

export const DELETE_FRIEND_REQUEST = 'friend/DELETE_FRIEND_REQUEST';
export const DELETE_FRIEND_SUCCESS = 'friend/DELETE_FRIEND_SUCCESS';
export const DELETE_FRIEND_FAILURE = 'friend/DELETE_FRIEND_FAILURE';

export const ADD_TO_FRIEND_LIST = 'friend/ADD_TO_FRIEND_LIST';

export const getFriendList = () => async (dispatch, getState) => {
  const userId = getState().userReducer.currentUser?.id;
  console.log(userId);
  dispatch({ type: GET_FRIEND_LIST_REQUEST });
  let result;
  try {
    // result = await axios.get(`user/${userId}/friends/`);
    result = {
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

export const deleteFriend = (friendId) => async (dispatch, getState) => {
  const userId = getState().userReducer.currentUser?.id;
  dispatch({ type: DELETE_FRIEND_REQUEST, userId });
  try {
    // await axios.delete(`/user/friendship/${friendId}/`);
  } catch (err) {
    dispatch({ type: DELETE_FRIEND_FAILURE, error: err });
  }
  dispatch({
    type: DELETE_FRIEND_SUCCESS,
    friendId
  });
};

export const acceptFriendRequest = (friendObj) => {
  // need api actions
  return {
    type: ADD_TO_FRIEND_LIST,
    friend: friendObj
  };
};

export const addFriend = (friendObj) => {
  return {
    type: ADD_TO_FRIEND_LIST,
    friend: friendObj
  };
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
    case ADD_TO_FRIEND_LIST:
      return {
        ...state,
        friendList: state.friendList
          ? [...state.friendList, action.friend]
          : [action.friend]
      };
    default:
      return state;
  }
}
