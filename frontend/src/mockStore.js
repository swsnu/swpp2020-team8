import { mockQuestions } from './constants';

export const mockStore = {
  friendReducer: {},
  notiReducer: {},
  postReducer: {},
  questionReducer: {
    sampleQuestions: mockQuestions
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
