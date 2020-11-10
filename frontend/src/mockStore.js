import {
  mockQuestions,
  mockQuestionFeed,
  mockRecommendQuestions
} from './constants';

export const mockStore = {
  friendReducer: {},
  notiReducer: {},
  postReducer: {},
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
