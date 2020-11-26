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

    store.dispatch(actionCreators.createComment(newComment)).then(() => {
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

  it('should return same state when api requested', () => {
    const initialState = {
      anonymousPosts: [],
      friendPosts: [],
      selectedUserPosts: [],
      selectedPost: {},
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
    // export const mockPost = {
    //   id: 1,
    //   'content-type': 'Article',
    //   is_admin_question: 'true',
    //   author_detail: {
    //     id: 1,
    //     username: 'admin',
    //     profile_pic: null
    //   },
    //   content: '사람들의 무리한 부탁을 잘 거절하는 편',
    //   created_at: '2020-11-05T14:16:13.801119+08:00',
    //   updated_at: null
    // };
    const newComment = {
      id: 124,
      target_type: 'Article',
      target_id: 1,
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
        next: null
      },
      {
        type: actionCreators.CREATE_COMMENT_SUCCESS,
        result: newComment
      }
    );
    expect(newState.friendPosts[0].comments.length).toEqual(prevLength + 1);
    expect(newState.selectedUserPosts[0].comments.length).toEqual(
      prevLength + 1
    );
    expect(newState.selectedPost.comments.length).toEqual(prevLength + 1);
  });

  // export const mockResponse = {
  //   id: 5999,
  //   'content-type': 'Response',
  //   type: 'Response',
  //   author_detail: {
  //     id: 123,
  //     username: 'curious',
  //     profile_pic:
  //       'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  //   },
  //   question: 1244,
  //   question_detail: {
  //     id: 1244,
  //     content: '어디서 마시는 커피를 가장 좋아하는가?'
  //   },
  //   content:
  //     '스타벅스에서 먹는 바닐라크림콜드브루! 시럽은 1번만 넣고 에스프레소휩을 올리면 행복~',
  //   comments: [
  //     {
  //       id: 1274,
  //       post_id: 383,
  //       content: '오 마져 맛이써!!!!',
  //       author: 3,
  //       author_detail: {
  //         id: 2,
  //         profile_pic:
  //           'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png',
  //         username: '아이폰'
  //       },
  //       referenced_comments: 1274,
  //       is_reply: false,
  //       is_private: true,
  //       create_dt: '2020-09-23T10:40:42.268355+08:00',
  //       update_dt: '2020-09-23T10:40:42.268384+08:00'
  //     }
  //   ],
  //   created_at: '2020-11-05T14:16:13.801119+08:00',
  //   updated_at: null
  // };

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
        next: null
      },
      {
        type: actionCreators.CREATE_REPLY_SUCCESS,
        result: newComment,
        postKey: 'Response-5999'
      }
    );
    expect(
      newState.friendPosts[0].comments.find(
        (item) => item.id === newComment.target_id
      ).replies?.length
    ).toEqual(prevLength + 1);
    expect(
      newState.selectedUserPosts[0].comments.find(
        (item) => item.id === newComment.target_id
      ).replies?.length
    ).toEqual(prevLength + 1);
    expect(
      newState.selectedPost.comments.find(
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
