/* eslint-disable no-unused-vars */
import axios from '../apis';
import store from '../store';
import {
  mockQuestionFeed,
  questionDetailPosts,
  mockResponseRequests
} from '../constants';
import * as actionCreators from './question';
import questionReducer from './question';

const observe = jest.fn();
const unobserve = jest.fn();

window.IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve
}));

describe('questionActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'getDailyQuestions' should get daily questions correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: {
            results: mockQuestionFeed
          }
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getDailyQuestions()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.dailyQuestions).toMatchObject(
        mockQuestionFeed
      );
      done();
    });
  });

  it('should dispatch question/GET_DAILY_QUESTIONS_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.getDailyQuestions()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
    });
  });

  it(`'getResponsesByQuestionWithType('all')' should get responses of selected question correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: questionDetailPosts,
          maxPage: 2
        };
        resolve(res);
      });
    });

    store
      .dispatch(actionCreators.getResponsesByQuestionWithType(1, 'all'))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
        expect(newState.questionReducer.selectedQuestion).toMatchObject(
          questionDetailPosts
        );
        expect(
          newState.questionReducer.selectedQuestionResponses
        ).toMatchObject(questionDetailPosts.response_set);
        done();
      });
  });

  it('should dispatch question/GET_SELECTED_QUESTION_ALL_RESPONSES_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store
      .dispatch(actionCreators.getResponsesByQuestionWithType(1, 'all'))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
      });
  });

  it(`'getResponsesByQuestionWithType('all') should get responses of selected question correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: questionDetailPosts,
          maxPage: 2
        };
        resolve(res);
      });
    });

    store
      .dispatch(actionCreators.getResponsesByQuestionWithType(1, 'all'))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
        expect(newState.questionReducer.selectedQuestion).toMatchObject(
          questionDetailPosts
        );
        expect(
          newState.questionReducer.selectedQuestionResponses
        ).toMatchObject(questionDetailPosts.response_set);
        done();
      });
  });

  it('should dispatch question/GET_SELECTED_ALL_QUESTION_RESPONSES_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store
      .dispatch(actionCreators.getResponsesByQuestionWithType(1, 'all'))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
      });
  });

  it(`'getResponseRequestByQuestion' should get response requests of selected question correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockResponseRequests
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getResponseRequestsByQuestion(1)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(
        newState.questionReducer.selectedQuestionResponseRequests
      ).toMatchObject(mockResponseRequests);
      done();
    });
  });

  it('should dispatch question/GET_RESPONSE_REQUESTS_FAILURE when api returns error', (done) => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.getResponseRequestsByQuestion(1)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.selectedQuestionResponseRequests).toEqual(
        []
      );
      done();
    });
  });

  it(`'createResponseRequest' should call post api properly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockResponseRequests
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.createResponseRequest(1, 2)).then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  it('should dispatch question/CREATE_RESPONSE_REQUEST_FAILURE when api returns error', (done) => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.createResponseRequest(1, 2)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.selectedQuestionResponseRequests).toEqual(
        []
      );
      done();
    });
  });

  it(`'deleteResponseRequest' should call delete api properly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockResponseRequests
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.deleteResponseRequest(1, 2)).then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  it('should dispatch question/DELETE_RESPONSE_REQUEST_FAILURE when api returns error', (done) => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.deleteResponseRequest(1, 2)).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.selectedQuestionResponseRequests).toEqual(
        []
      );
      done();
    });
  });
});

describe('Question Reducer', () => {
  it('should return default state', () => {
    const newState = questionReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      dailyQuestions: [],
      sampleQuestions: [],
      randomQuestions: [],
      recommendedQuestions: [],
      selectedQuestion: null,
      selectedQuestionResponses: [],
      selectedQuestionResponseRequests: [],
      next: null,
      maxPage: null
    });
  });

  it('should add daily question to feed when append success', () => {
    const newState = questionReducer(
      {
        dailyQuestions: [],
        sampleQuestions: [],
        randomQuestions: [],
        recommendedQuestions: [],
        selectedQuestion: null,
        selectedQuestionResponses: [],
        next: null
      },
      {
        type: actionCreators.APPEND_QUESTIONS_SUCCESS,
        questions: mockQuestionFeed,
        next: 'mockUrl'
      }
    );
    expect(newState).toEqual({
      dailyQuestions: mockQuestionFeed,
      sampleQuestions: [],
      randomQuestions: [],
      recommendedQuestions: [],
      selectedQuestion: null,
      selectedQuestionResponses: [],
      next: 'mockUrl'
    });
  });
});
