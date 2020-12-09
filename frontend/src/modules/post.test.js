import axios from '../apis';
import {
  mockAnonymousFeed,
  mockArticle,
  mockFriendFeed,
  mockPost,
  mockResponse
} from '../constants';
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

    store.dispatch(actionCreators.appendPosts('friend')).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(0);
      expect(newState.postReducer.friendPosts).toEqual(mockFriendFeed);
      expect(newState.postReducer.next).toEqual(null);
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
    jest.mock('axios');

    axios.get.mockResolvedValue([]);
    const newPost = {
      ...mockArticle,
      type: 'Article',
      share_anonymously: true,
      share_with_friends: true
    };
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: newPost
        };
        resolve(result);
      });
    });

    const prevState = store.getState();

    store.dispatch(actionCreators.createPost(newPost)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.postReducer.anonymousPosts.length).toEqual(
        prevState.postReducer.anonymousPosts.length + 1
      );
      expect(newState.postReducer.friendPosts.length).toEqual(
        prevState.postReducer.friendPosts.length + 1
      );
      done();
    });
  });

  it(`createComment should create comment correctly`, (done) => {
    jest.mock('axios');

    const newComment = {
      target_type: 'Article',
      target_id: mockPost.id,
      content: 'content',
      is_private: false
    };

    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: newComment
        };
        resolve(result);
      });
    });

    const postKey = `Article-${mockPost.id}`;
    store
      .dispatch(actionCreators.createComment(newComment, postKey))
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`createReply should create reply correctly`, (done) => {
    jest.mock('axios');

    const newReply = {
      target_type: 'Comment',
      target_id: 1,
      content: 'reply',
      is_private: false
    };

    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: newReply
        };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.createReply(newReply)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`deletePost should make delete call`, (done) => {
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          status: 301
        };
        resolve(result);
      });
    });

    store
      .dispatch(actionCreators.deletePost(mockPost.id, 'Article'))
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`deleteComment should make delete call`, (done) => {
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          status: 301
        };
        resolve(result);
      });
    });

    store
      .dispatch(actionCreators.deleteComment(1, 'Article-1', false))
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it(`'getSelectedPost' should work correctly`, async (done) => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockArticle
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getSelectedPost('article', 1)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.postReducer.selectedPostFailure).toBeFalsy();
      done();
    });
  });

  it(`should patch 'GET_SELECTED_ARTICLE_FAILURE' when get post failure`, () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({ response: { status: 403 } })
    );

    store.dispatch(actionCreators.getSelectedPost('response', 1)).catch(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.postReducer.selectedPost).toEqual(null);
      expect(newState.postReducer.selectedPostFailure).toEqual(true);
    });
  });

  it(`'editSelectedPost' for article should work correctly`, async (done) => {
    jest.mock('axios');
    const spyForArticle = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockPost
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.editSelectedPost(mockPost)).then(() => {
      const newState = store.getState();
      expect(spyForArticle).toHaveBeenCalled();
      expect(newState.postReducer.selectedPost).toMatchObject(mockPost);
      done();
    });
  });

  it(`'editSelectedPost' for response should work correctly`, async (done) => {
    jest.mock('axios');
    const spyForArticle = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockResponse
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.editSelectedPost(mockResponse)).then(() => {
      const newState = store.getState();
      expect(spyForArticle).toHaveBeenCalled();
      expect(newState.postReducer.selectedPost).toMatchObject(mockResponse);
      done();
    });
  });

  it(`'appendPosts' should work correctly when post list has next`, async (done) => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: {
            results: mockFriendFeed,
            next: 'next'
          }
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getPostsByType('friend')).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.postReducer.friendPosts).toMatchObject(mockFriendFeed);
      expect(newState.postReducer.next).toEqual('next');
      done();
    });

    store.dispatch(actionCreators.appendPosts('friend')).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(newState.postReducer.friendPosts).toMatchObject(mockFriendFeed);
      expect(newState.postReducer.next).toEqual('next');
      done();
    });
  });
});

describe('Post Reducer', () => {
  it('should return default state', () => {
    const newState = postReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      anonymousPosts: [],
      friendPosts: [],
      selectedUserPosts: [],
      selectedPostFailure: false,
      selectedUserId: null,
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

  it('should add post to feed when append friend posts success', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.APPEND_POSTS_SUCCESS,
        origin: 'friend',
        posts: mockFriendFeed
      }
    );
    expect(newState).toEqual({
      anonymousPosts: [],
      friendPosts: mockFriendFeed,
      selectedUserPosts: [],
      selectedPost: {},
      selectedUserId: null,
      next: undefined
    });
  });

  it('should add post to feed when append anon posts success', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.APPEND_POSTS_SUCCESS,
        origin: 'anonymous',
        posts: mockFriendFeed
      }
    );
    expect(newState).toEqual({
      anonymousPosts: mockFriendFeed,
      friendPosts: [],
      selectedUserPosts: [],
      selectedPost: {},
      selectedUserId: null,
      next: undefined
    });
  });

  it('should return same state when api requested', () => {
    const initialState = {
      anonymousPosts: [],
      friendPosts: [],
      selectedUserPosts: [],
      selectedPost: {},
      selectedUserId: null,
      next: null
    };
    let newState = postReducer(
      { ...initialState },
      {
        type: actionCreators.GET_SELECTED_ARTICLE_REQUEST
      }
    );
    expect(newState).toMatchObject(initialState);
    newState = postReducer(
      { ...initialState },
      {
        type: actionCreators.GET_SELECTED_RESPONSE_REQUEST
      }
    );
    expect(newState).toMatchObject(initialState);
    newState = postReducer(
      { ...initialState },
      {
        type: actionCreators.GET_SELECTED_QUESTION_REQUEST
      }
    );
    expect(newState).toMatchObject(initialState);
  });

  it('should update selected post when get selected post success', () => {
    const initialState = {
      anonymousPosts: [],
      friendPosts: [],
      selectedUserPosts: [],
      selectedPost: {},
      next: null
    };
    const newState = postReducer(
      { ...initialState },
      {
        type: actionCreators.GET_SELECTED_ARTICLE_SUCCESS,
        selectedPost: mockArticle
      }
    );
    expect(newState.selectedPost).toMatchObject(mockArticle);
  });

  it('should add post to feed when create success', () => {
    const newPost = {
      ...mockArticle,
      share_anonymously: true,
      share_with_friends: true
    };
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        selectedUserId: null,
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

  it('should not add post to feed when create fails', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [],
        selectedUserPosts: [],
        selectedPost: {},
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.CREATE_POST_FAILURE
      }
    );
    expect(newState.friendPosts.length).toEqual(0);
    expect(newState.anonymousPosts.length).toEqual(0);
  });

  it('should add comment to friendPosts/SelectedPost/userPosts when create comment success', () => {
    const newComment = {
      id: 124,
      target_type: 'Article',
      target_id: mockPost.id,
      content: 'test comment',
      author_detail: {
        id: 1,
        username: 'admin',
        profile_pic: null
      }
    };
    const prevLength = mockPost.comments ? mockPost.comments.length : 0;
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [mockPost],
        selectedUserPosts: [mockPost],
        selectedPost: mockPost,
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.CREATE_COMMENT_SUCCESS,
        result: newComment,
        postKey: `Article-${mockPost.id}`
      }
    );
    expect(newState.friendPosts[0].comments.length).toEqual(prevLength + 1);
    expect(newState.selectedUserPosts[0].comments.length).toEqual(
      prevLength + 1
    );
    expect(newState.selectedPost.comments.length).toEqual(prevLength + 1);
  });

  it('should add comment to anonPosts when create anon comment success', () => {
    const newComment = {
      id: 124,
      target_type: 'Article',
      target_id: mockPost.id,
      content: 'test comment',
      is_anonymous: true,
      author_detail: {
        id: 1,
        username: 'admin',
        profile_pic: null
      }
    };
    const prevLength = mockPost.comments ? mockPost.comments.length : 0;
    const newState = postReducer(
      {
        anonymousPosts: [mockPost],
        friendPosts: [mockPost],
        selectedUserPosts: [mockPost],
        selectedPost: mockPost,
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.CREATE_COMMENT_SUCCESS,
        result: newComment,
        postKey: `Article-${mockPost.id}`
      }
    );
    expect(newState.friendPosts[0].comments.length).toEqual(prevLength + 1);
    expect(newState.selectedUserPosts[0].comments.length).toEqual(
      prevLength + 1
    );
    expect(newState.anonymousPosts[0].comments.length).toEqual(prevLength + 1);
    expect(newState.selectedPost.comments.length).toEqual(prevLength + 1);
  });

  it('should add reply to posts when create reply success', () => {
    const newComment = {
      id: 1423424,
      target_type: 'Comment',
      target_id: 1274,
      content: 'test reply',
      author_detail: {
        id: 1,
        username: 'admin',
        profile_pic: null
      }
    };
    const prevLength = mockResponse.comments.replies
      ? mockPost.comments.replies.length
      : 0;
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [mockResponse, mockPost],
        selectedUserPosts: [mockResponse, mockPost],
        selectedPost: mockResponse,
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.CREATE_REPLY_SUCCESS,
        result: newComment,
        postKey: 'Response-5999'
      }
    );
    expect(
      newState.friendPosts[0].comments?.find(
        (item) => item.id === newComment.target_id
      ).replies?.length
    ).toEqual(prevLength + 1);
    // expect(
    //   newState.selectedUserPosts[0].comments?.find(
    //     (item) => item.id === newComment.target_id
    //   ).replies?.length
    // ).toEqual(prevLength + 1);
    expect(
      newState.selectedPost.comments?.find(
        (item) => item.id === newComment.target_id
      ).replies?.length
    ).toEqual(prevLength + 1);
  });

  it('should add reply to anon posts when create anon reply success', () => {
    const newComment = {
      id: 1423424,
      target_type: 'Comment',
      is_anonymous: true,
      target_id: 1274,
      content: 'test reply',
      author_detail: {
        id: 1,
        username: 'admin',
        profile_pic: null
      }
    };
    const prevLength = mockResponse.comments.replies
      ? mockPost.comments.replies.length
      : 0;
    const newState = postReducer(
      {
        anonymousPosts: [mockResponse, mockPost],
        friendPosts: [mockResponse, mockPost],
        selectedUserPosts: [mockResponse, mockPost],
        selectedPost: mockResponse,
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.CREATE_REPLY_SUCCESS,
        result: newComment,
        postKey: 'Response-5999'
      }
    );
    expect(
      newState.anonymousPosts[0].comments.find(
        (item) => item.id === newComment.target_id
      ).replies?.length
    ).toEqual(prevLength + 1);
  });

  it('should delete reply after delete success @ friendPosts, selectedPost, userPosts', () => {
    const newState = postReducer(
      {
        anonymousPosts: [],
        friendPosts: [mockArticle, mockPost],
        selectedUserPosts: [mockArticle, mockPost],
        selectedPost: mockArticle,
        selectedUserId: null,
        next: null
      },
      {
        type: actionCreators.DELETE_COMMENT_SUCCESS,
        commentId: 1273,
        isReply: true,
        postKey: 'Article-4756'
      }
    );
    expect(
      newState.friendPosts[0].comments.find((item) => +item.id === 1272).replies
        ?.length
    ).toEqual(0);
    expect(
      newState.selectedUserPosts[0].comments.find((item) => +item.id === 1272)
        .replies?.length
    ).toEqual(0);
    expect(
      newState.selectedPost.comments.find((item) => +item.id === 1272).replies
        ?.length
    ).toEqual(0);
  });
});
