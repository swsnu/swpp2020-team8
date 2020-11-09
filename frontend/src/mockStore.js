import { mockQuestions } from './constants';

export const mockStore = {
  friendReducer: {},
  notiReducer: {},
  postReducer: {},
  questionReducer: {
    sampleQuestions: mockQuestions
  },
  userReducer: {
    loading: false,
    error: false,
    user: null,
    users: [
      {
        id: 1,
        email: 'swpp@snu.ac.kr',
        password: 'iluvswpp',
        isLoggedIn: true
      }
    ]
  }
};

export const mockFriendReducer = {};
