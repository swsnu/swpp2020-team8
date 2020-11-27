import {
  mockPost,
  mockCustomQuestion,
  mockQuestions,
  mockQuestionFeed,
  mockRecommendQuestions,
  mockResponse,
  mockResponse2,
  mockResponseRequests,
  mockFriendList
} from './constants';

export const mockStore = {
  friendReducer: {
    friendList: mockFriendList,
    selectedUser: {},
    selectedUserPosts: []
  },
  notiReducer: {},
  postReducer: {
    selectedPost: mockCustomQuestion
  },
  questionReducer: {
    dailyQuestions: mockQuestionFeed,
    randomQuestions: mockRecommendQuestions,
    sampleQuestions: mockQuestions,
    recommendedQuestions: mockRecommendQuestions,
    selectedQuestion: mockQuestionFeed[0],
    selectedQuestionResponses: [mockResponse, mockResponse2],
    responseRequests: mockResponseRequests
  },
  userReducer: {
    error: false,
    user: {
      id: 123,
      username: 'curious',
      isLoggedIn: true
    }
  }
};

export const mockStoreBeforeLogin = {
  friendReducer: {},
  notiReducer: {},
  postReducer: {
    selectedPost: mockPost
  },
  questionReducer: {
    dailyQuestions: mockQuestionFeed,
    randomQuestions: mockRecommendQuestions,
    sampleQuestions: mockQuestions,
    recommendedQuestions: mockRecommendQuestions
  },
  userReducer: {
    error: false,
    user: null
  }
};

export const mockStoreWithArticle = {
  friendReducer: {},
  notiReducer: {},
  postReducer: {
    selectedPost: mockPost
  },
  questionReducer: {
    dailyQuestions: mockQuestionFeed,
    randomQuestions: mockRecommendQuestions,
    sampleQuestions: mockQuestions,
    recommendedQuestions: mockRecommendQuestions
  },
  userReducer: {
    error: false,
    user: {
      id: 0,
      username: 'mock',
      isLoggedIn: false
    }
  }
};

export const mockFriendReducer = {};
