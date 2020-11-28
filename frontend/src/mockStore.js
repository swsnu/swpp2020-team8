import {
  mockPost,
  mockCustomQuestion,
  mockQuestions,
  mockQuestionFeed,
  mockRecommendQuestions,
  mockNotifications,
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
  notiReducer: {
    receivedNotifications: mockNotifications
  },
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
    selectedQuestionResponses: [mockResponse, mockResponse2],
    responseRequests: mockResponseRequests
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
  notiReducer: {
    receivedNotifications: mockNotifications
  },
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
