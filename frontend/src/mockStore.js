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
      },
      {
        id: 2,
        email: 'alan@turing.com',
        password: 'iluvswpp',
        isLoggedIn: false
      },
      {
        id: 3,
        email: 'edsger@dijkstra.com',
        password: 'iluvswpp',
        isLoggedIn: false
      }
    ]
  }
};

export const mockFriendReducer = {};
