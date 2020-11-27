import axios from '../apis';
import { mockFriendList } from '../constants';
import store from '../store';
import friendReducer, * as actionCreators from './friend';

describe('friendActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'getFriendList' should fetch friends`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: {
            results: mockFriendList
          }
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getFriendList()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.friendReducer.friendList).toMatchObject(mockFriendList);
      done();
    });
  });

  it(`'deleteFriend' should delete friend correctly`, (done) => {
    store.dispatch(actionCreators.deleteFriend(1)).then(() => {
      const newState = store.getState();
      const { friendList } = newState.friendReducer;
      //   expect(spy).toHaveBeenCalledTimes(1);
      const newFriendList = friendList.filter((friend) => friend.id !== 1);
      expect(newState.friendReducer.friendList).toMatchObject(newFriendList);
      done();
    });
  });
});

describe('Friend Reducer', () => {
  it('should return default state', () => {
    const newState = friendReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      friendList: [],
      selectedUser: {},
      selectedUserPosts: []
    });
  });

  it('should add friends to friendList when get success', () => {
    const newState = friendReducer(
      {
        friendList: [],
        selectedUser: {},
        selectedUserPosts: []
      },
      {
        type: actionCreators.GET_FRIEND_LIST_SUCCESS,
        result: mockFriendList
      }
    );
    expect(newState).toMatchObject({
      friendList: mockFriendList,
      selectedUser: {},
      selectedUserPosts: []
    });
  });

  it('should delete friend in friendList when delete success', () => {
    const newState = friendReducer(
      {
        friendList: mockFriendList,
        selectedUser: {},
        selectedUserPosts: []
      },
      {
        type: actionCreators.DELETE_FRIEND_SUCCESS,
        friendId: 1
      }
    );

    const newFriendList = mockFriendList.filter((friend) => friend.id !== 1);

    expect(newState).toMatchObject({
      friendList: newFriendList,
      selectedUser: {},
      selectedUserPosts: []
    });
  });
});
