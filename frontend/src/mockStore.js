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
      isLoggedIn: false
    }
  }
};

export const mockFriendReducer = {};
