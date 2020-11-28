import {
  mockPost,
  mockCustomQuestion,
  mockQuestions,
  mockQuestionFeed,
  mockRecommendQuestions,
  mockResponse,
  mockResponse2
} from './constants';

export const mockStore = {
  friendReducer: {
    friendList: [{ username: 'friend', id: 1 }]
  },
  notiReducer: {},
  postReducer: {
    selectedPost: mockCustomQuestion,
    selectedUserPosts: [mockResponse, mockResponse2]
  },
  questionReducer: {
    dailyQuestions: mockQuestionFeed,
    randomQuestions: mockRecommendQuestions,
    sampleQuestions: mockQuestions,
    recommendedQuestions: mockRecommendQuestions,
    selectedQuestion: mockQuestionFeed[0],
    selectedQuestionResponses: [mockResponse, mockResponse2]
  },
  userReducer: {
    error: false,
    user: {
      id: 123,
      username: 'curious',
      isLoggedIn: true
    },
    selectedUser: {
      id: 1,
      username: 'friend'
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
