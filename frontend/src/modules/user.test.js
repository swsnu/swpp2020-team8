/* eslint-disable prefer-promise-reject-errors */
import axios from '../apis';
import store from '../store';
import userReducer, * as actionCreators from './user';

describe('user Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'signup' should post signup info correctly`, (done) => {
    jest.mock('axios');

    const userInfo = {
      id: 1,
      password: 'password',
      username: 'user',
      email: 'user@user.com'
    };
    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = { data: userInfo };
        resolve(result);
      });
    });

    jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = { data: { ...userInfo, question_history: null } };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.requestSignUp(userInfo)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.userReducer.signUpError).toBeFalsy();
      done();
    });
  });

  it(`'logout' should log out correctly`, (done) => {
    jest.mock('axios');
    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = { data: null };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.logout()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.userReducer.user).toBeFalsy();
      done();
    });
  });

  it(`should turn on login error when login api error occurs`, (done) => {
    jest.mock('axios');
    const userInfo = {
      id: 1,
      password: 'password',
      username: 'user',
      email: 'user@user.com'
    };

    // axios.post.mockRejectedValueOnce();
    // const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
    //   return new Promise((resolve, reject) => {
    //     const result = { data: userInfo };
    //     reject(result);
    //   });
    // });
    axios.post.mockReturnValue(Promise.reject({ error: 'error' }));
    axios.get.mockReturnValue(Promise.reject({ error: 'error' }));

    store
      .dispatch(actionCreators.requestLogin(userInfo))
      .then(() => {
        done();
      })
      .catch(() => {
        const newState = store.getState();
        expect(newState.userReducer.user).toBeFalsy();
        expect(newState.userReducer.loginError).toBeTruthy();
      });
  });

  it(`should make patch call & update user question history when select questions`, (done) => {
    jest.mock('axios');

    const questionSelection = '[1]';
    const spy = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = { data: questionSelection };
        resolve(result);
      });
    });

    store
      .dispatch(actionCreators.postSelectedQuestions(questionSelection))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
        expect(newState.userReducer.user.questionHistory).toEqual(
          questionSelection
        );
        done();
      });
  });
  it(`'login' should log in & update user info @ store`, (done) => {
    jest.mock('axios');

    const userInfo = {
      id: 1,
      password: 'password',
      username: 'user',
      email: 'user@user.com'
    };
    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = { data: userInfo };
        resolve(result);
      });
    });

    const getSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = { code: 200, data: userInfo };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.requestLogin(userInfo)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(newState.userReducer.user).toMatchObject(userInfo);
      done();
    });
  });
});

describe('User Reducer', () => {
  it('should return default state', () => {
    const newState = userReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      loginError: false,
      signUpError: {},
      user: null
    });
  });

  // it('should add post to feed when get success', () => {
  //   const newState = postReducer(
  //     {
  //       anonymousPosts: [],
  //       friendPosts: [],
  //       selectedUserPosts: [],
  //       selectedPost: {},
  //       next: null
  //     },
  //     {
  //       type: actionCreators.GET_FRIEND_POSTS_SUCCESS,
  //       result: mockFriendFeed
  //     }
  //   );
  //   expect(newState).toEqual({
  //     anonymousPosts: [],
  //     friendPosts: mockFriendFeed,
  //     selectedUserPosts: [],
  //     selectedPost: {},
  //     next: undefined
  //   });
  // });

  it('should reset user to null after logout', () => {
    const newState = userReducer(
      {
        loginError: false,
        signUpError: {},
        user: { id: 1 }
      },
      {
        type: actionCreators.LOGOUT_SUCCESS
      }
    );
    expect(newState.user).toEqual(null);
  });

  it('should update user info question after selecting question', () => {
    const newState = userReducer(
      {
        loginError: false,
        signUpError: {},
        user: { id: 1 }
      },
      {
        type: actionCreators.UPDATE_QUESTION_SELECT,
        selectedQuestions: '[1, 2, 3]'
      }
    );
    expect(newState.user.questionHistory).toEqual('[1, 2, 3]');
  });

  it('should not update user info while waiting on login api response', () => {
    const newState = userReducer(
      {
        loginError: false,
        signUpError: {},
        user: { id: 1 }
      },
      {
        type: actionCreators.LOGIN_REQUEST
      }
    );
    expect(newState.user).toBeFalsy();
    expect(newState.loginError).toBeFalsy();
  });

  it('should not update user info while waiting on signup api response', () => {
    const newState = userReducer(
      {
        loginError: false,
        signUpError: {},
        user: { id: 1 }
      },
      {
        type: actionCreators.SIGN_UP_REQUEST
      }
    );
    expect(newState.user).toBeFalsy();
    expect(newState.signUpError).toBeFalsy();
  });

  // it('should add post to feed when create success', () => {
  //   const newState = postReducer(
  //     {
  //       anonymousPosts: [],
  //       friendPosts: [],
  //       selectedUserPosts: [],
  //       selectedPost: {},
  //       next: null
  //     },
  //     {
  //       type: actionCreators.CREATE_POST_FAILURE
  //     }
  //   );
  //   expect(newState.friendPosts.length).toEqual(0);
  //   expect(newState.anonymousPosts.length).toEqual(0);
  // });
});
