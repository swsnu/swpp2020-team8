import {
  mockPost,
  mockCustomQuestion,
  mockQuestions,
  mockQuestionFeed,
  mockRecommendQuestions
} from './constants';

export const mockStore = {
  friendReducer: {},
  notiReducer: {},
  postReducer: {
    selectedPost: mockCustomQuestion
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
