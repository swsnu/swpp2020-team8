import axios from '../apis';
import { mockFriendList } from '../constants';
import store from '../store';
import friendReducer, * as actionCreators from './friend';

const result = {
  data: {
    count: 4,
    results: mockFriendList
  }
};

describe('friendActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'getFriendList' should fetch friends`, (done) => {
    jest.mock('axios');

    // axios.get.mockResolvedValue(result);
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(result);
      });
    });

    store.dispatch(actionCreators.getFriendList()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.friendReducer.friendList).toMatchObject(mockFriendList);
      done();
    });
  });

  it(`should not modify friend list when get friend list has error`, (done) => {
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });
    store.dispatch(actionCreators.getFriendList()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.friendReducer.friendList).toMatchObject([]);
      done();
    });
  });

  it(`'deleteFriend' should delete friend correctly`, (done) => {
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });
    store.dispatch(actionCreators.deleteFriend(1)).then(() => {
      const newState = store.getState();
      const { friendList } = newState.friendReducer;
      expect(spy).toHaveBeenCalledTimes(1);
      const newFriendList = friendList.filter((friend) => friend.id !== 1);
      expect(newState.friendReducer.friendList).toMatchObject(newFriendList);
      done();
    });
  });

  it(`should not modify friend list when delete friend has error`, (done) => {
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });
    const { friendList } = store.getState().friendReducer;

    store.dispatch(actionCreators.deleteFriend(1)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.friendReducer.friendList).toMatchObject(friendList);
      done();
    });
  });

  it(`should not modify friend list when delete friend request has error`, (done) => {
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });
    store.dispatch(actionCreators.deleteFriendRequest(1)).then(() => {
      const newState = store.getState();
      const { friendList } = newState.friendReducer;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.friendReducer.friendList).toMatchObject(friendList);
      done();
    });
  });

  it(`'deleteFriendRequest' should make delete call`, (done) => {
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });
    store.dispatch(actionCreators.deleteFriendRequest(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'acceptFriendRequest' should make patch call`, (done) => {
    const spy = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });
    store.dispatch(actionCreators.acceptFriendRequest(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'requestFriend' should make post call`, (done) => {
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });
    store.dispatch(actionCreators.requestFriend(1)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
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
      selectedUserPosts: [],
      friendRequestError: false
    });
  });

  it('should add friends to friendList when get success', () => {
    const newState = friendReducer(
      {
        friendList: [],
        selectedUser: {},
        selectedUserPosts: [],
        friendRequestError: false
      },
      {
        type: actionCreators.GET_FRIEND_LIST_SUCCESS,
        result: mockFriendList
      }
    );
    expect(newState).toMatchObject({
      friendList: mockFriendList,
      selectedUser: {},
      selectedUserPosts: [],
      friendRequestError: false
    });
  });

  it('should delete friend in friendList when delete success', () => {
    const newState = friendReducer(
      {
        friendList: mockFriendList,
        selectedUser: {},
        selectedUserPosts: [],
        friendRequestError: false
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
      selectedUserPosts: [],
      friendRequestError: false
    });
  });

  it('should reflect error when friend request failed', () => {
    const newState = friendReducer(
      {
        friendList: mockFriendList,
        selectedUser: {},
        selectedUserPosts: [],
        friendRequestError: false
      },
      {
        type: actionCreators.REQUEST_FRIEND_FAILURE,
        error: 'error'
      }
    );

    expect(newState).toMatchObject({
      friendList: mockFriendList,
      selectedUser: {},
      selectedUserPosts: [],
      friendRequestError: 'error'
    });
  });
});
