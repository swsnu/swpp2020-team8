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
    selectedUserPosts: [mockResponse, mockResponse2],
    selectedPostFailure: false
  },
  questionReducer: {
    dailyQuestions: mockQuestionFeed,
    randomQuestions: mockRecommendQuestions,
    sampleQuestions: mockQuestions,
    recommendedQuestions: mockRecommendQuestions,
    selectedQuestion: mockQuestionFeed[0],
    selectedQuestionResponses: [mockResponse, mockResponse2],
    selectedQuestionResponseRequests: mockResponseRequests,
    next: 'http://localhost:8000/api/feed/questions/daily/?page=2'
  },
  userReducer: {
    error: false,
    currentUser: {
      id: 123,
      username: 'curious',
      isLoggedIn: true
    },
    selectedUser: {
      id: 1,
      username: 'friend'
    }
  },
  searchReducer: {
    searchObj: {
      searchError: false,
      results: [
        {
          id: 123,
          username: 'curious'
        }
      ],
      loading: false,
      message: '',
      totalPages: 3,
      currentPageNo: 2,
      numResults: 15
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
    currentUser: null
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
    currentUser: {
      id: 0,
      username: 'mock',
      isLoggedIn: false
    }
  }
};

export const mockFriendReducer = {};
