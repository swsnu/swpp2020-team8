import axios from '../apis';
import store from '../store';
import { mockQuestionFeed, questionDetailPosts } from '../constants';
import * as actionCreators from './question';
import questionReducer from './question';

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
      expect(newState.questionReducer.dailyQuestions).toMatchObject(
        mockQuestionFeed
      );
    });
  });

  it(`'getResponsesByQuestion' should get responses of selected question correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: questionDetailPosts
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getResponsesByQuestion()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.selectedQuestion).toMatchObject(
        questionDetailPosts
      );
      expect(newState.questionReducer.selectedQuestionResponses).toMatchObject(
        questionDetailPosts.response_set
      );
      done();
    });
  });

  it('should dispatch question/GET_SELECTED_QUESTION_RESPONSES_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.getResponsesByQuestion()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.questionDetailPosts).toMatchObject(
        questionDetailPosts
      );
    });
  });

  it(`'getFriendResponsesByQuestion' should get responses of selected question correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: questionDetailPosts
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getFriendResponsesByQuestion()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.selectedQuestion).toMatchObject(
        questionDetailPosts
      );
      expect(newState.questionReducer.selectedQuestionResponses).toMatchObject(
        questionDetailPosts.response_set
      );
      done();
    });
  });

  it('should dispatch question/GET_SELECTED_QUESTION_RESPONSES_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.getFriendResponsesByQuestion()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.questionReducer.questionDetailPosts).toMatchObject(
        questionDetailPosts
      );
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
      next: null
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
