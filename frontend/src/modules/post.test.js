import axios from '../apis';
import { mockAnonymousFeed, mockArticle, mockFriendFeed } from '../constants';
import store from '../store';
import postReducer, * as actionCreators from './post';

describe('postActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'getPostsByType:friend' should fetch posts correctly`, (done) => {
    jest.mock('axios');

    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            status: 200,
            results: mockFriendFeed,
            next: null
          }
        };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.getPostsByType('friend')).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.postReducer.friendPosts).toMatchObject(mockFriendFeed);
      done();
    });
  });

  it(`'getPostsByType:anonymous' should fetch posts correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: { status: 200, next: null, results: mockAnonymousFeed }
        };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.getPostsByType('anon')).then(() => {
      const newState = store.getState();
      expect(newState.postReducer.anonymousPosts).toMatchObject(
        mockAnonymousFeed
      );
      expect(spy).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it(`'getPostsByType:user' should fetch posts correctly`, (done) => {
    jest.mock('axios');

    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            status: 200,
            results: mockFriendFeed,
            next: null
          }
        };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.getPostsByType('user', 2)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.postReducer.selectedUserPosts).toMatchObject(
        mockFriendFeed
      );
      done();
    });
  });

  it(`createPost should post correctly`, (done) => {
    // jest.mock('axios');

    // axios.get.mockResolvedValue([]);
    // const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
    //   return new Promise((resolve) => {
    //     const result = {
    //       data: {
    //         status: 200,
    //         results: mockFriendFeed,
    //         next: null
    //       }
    //     };
    //     resolve(result);
    //   });
    // });
    const newPost = {
      ...mockArticle,
      shareAnonymously: true,
      shareWithFriends: true
    };
    const prevState = store.getState();

    store.dispatch(actionCreators.createPost(newPost)).then(() => {
      const newState = store.getState();
      // expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.postReducer.anonymousPosts.length).toEqual(
        prevState.postReducer.anonymousPosts.length + 1
      );
      expect(newState.postReducer.friendPosts.length).toEqual(
        prevState.postReducer.friendPosts.length + 1
      );
      done();
    });
  });

  // it(`'createArticle' should post article correctly`, (done) => {
  //   const spy = jest.spyOn(axios, 'post').mockImplementation((url, article) => {
  //     return new Promise((resolve, reject) => {
  //       const result = {
  //         status: 200,
  //         data: stubArticle
  //       };
  //       resolve(result);
  //     });
  //   });

  //   store.dispatch(actionCreators.createArticle(stubArticle)).then(() => {
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     done();
  //   });
  // });

  // it(`'editArticle' should edit article correctly`, (done) => {
  //   const spy = jest.spyOn(axios, 'put').mockImplementation((url, id) => {
  //     return new Promise((resolve, reject) => {
  //       const result = {
  //         status: 200,
  //         data: stubArticle
  //       };
  //       resolve(result);
  //     });
  //   });

  //   store.dispatch(actionCreators.editArticle(stubArticle)).then(() => {
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     done();
  //   });
  // });

  // it(`'deleteArticle' should delete todo correctly`, (done) => {
  //   const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
  //     return new Promise((resolve, reject) => {
  //       const result = {
  //         status: 200,
  //         data: null
  //       };
  //       resolve(result);
  //     });
  //   });

  //   store.dispatch(actionCreators.deleteArticle()).then(() => {
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     done();
  //   });
  // });
});

describe('Post Reducer', () => {
  it('should return default state', () => {
    const newState = postReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      anonymousPosts: [],
      friendPosts: [],
      selectedUserPosts: [],
      next: null,
      selectedPost: null
    });
  });

  it('should add post to feed when get success', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        next: null
      },
      {
        type: actionCreators.GET_FRIEND_POSTS_SUCCESS,
        result: mockFriendFeed
      }
    );
    expect(newState).toEqual({
      anonymousPosts: [],
      friendPosts: mockFriendFeed,
      selectedUserPosts: [],
      selectedPost: {},
      next: undefined
    });
  });

  it('should add post to feed when create success', () => {
    const newPost = {
      ...mockArticle,
      shareAnonymously: true,
      shareWithFriends: true
    };
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        next: null
      },
      {
        type: actionCreators.CREATE_POST_SUCCESS,
        newPost
      }
    );
    expect(newState.friendPosts.length).toEqual(1);
    expect(newState.anonymousPosts.length).toEqual(1);
  });

  it('should add post to feed when create success', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        next: null
      },
      {
        type: actionCreators.CREATE_POST_FAILURE
      }
    );
    expect(newState.friendPosts.length).toEqual(0);
    expect(newState.anonymousPosts.length).toEqual(0);
  });
});
