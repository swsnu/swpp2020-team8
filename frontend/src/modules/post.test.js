// import axios from 'axios';
import { mockAnonymousFeed, mockFriendFeed } from '../constants';
import store from '../store';
import postReducer, * as actionCreators from './post';

describe('postActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'getPostsByType:friend' should fetch posts correctly`, (done) => {
    // const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
    //   return new Promise((resolve, reject) => {
    //     const result = {
    //       status: 200,
    //       data: mockFriendFeed
    //     };
    //     resolve(result);
    //   });
    // });

    store.dispatch(actionCreators.getPostsByType('friend')).then(() => {
      const newState = store.getState();
      expect(newState.postReducer.friendPosts).toMatchObject(mockFriendFeed);
      done();
    });
  });

  it(`'getPostsByType:anonymous' should fetch posts correctly`, (done) => {
    // const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
    //   return new Promise((resolve, reject) => {
    //     const result = {
    //       status: 200,
    //       data: mockFriendFeed
    //     };
    //     resolve(result);
    //   });
    // });

    store.dispatch(actionCreators.getPostsByType('anon')).then(() => {
      const newState = store.getState();
      expect(newState.postReducer.anonymousPosts).toMatchObject(
        mockAnonymousFeed
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

describe('Todo Reducer', () => {
  it('should return default state', () => {
    const newState = postReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      anonymousPosts: [],
      friendPosts: [],
      selectedUserPosts: [],
      selectedPost: {}
    });
  });

  it('should add post to feed when get success', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {}
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
      selectedPost: {}
    });
  });
});
