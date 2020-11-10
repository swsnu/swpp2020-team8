// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import {
  mockQuestions,
  mockQuestionFeed,
  mockRecommendQuestions
} from '../constants';

export const GET_SAMPLE_QUESTIONS = 'question/GET_SAMPLE_QUESTIONS';
export const GET_SAMPLE_QUESTIONS_SUCCESS =
  'question/GET_SAMPLE_QUESTIONS_SUCCESS';
export const RESET_QUESTIONS = 'question/RESET_QUESTIONS';

export const GET_RECOMMENDED_QUESTIONS_REQUEST =
  'question/GET_RECOMMENDED_QUESTIONS_REQUEST';
export const GET_RECOMMENDED_QUESTIONS_SUCCESS =
  'question/GET_RECOMMENDED_QUESTIONS_SUCCESS';
export const GET_RECOMMENDED_QUESTIONS_FAILURE =
  'question/GET_RECOMMENDED_QUESTIONS_FAILURE';

export const GET_DAILY_QUESTIONS_REQUEST =
  'question/GET_DAILY_QUESTIONS_REQUEST';
export const GET_DAILY_QUESTIONS_SUCCESS =
  'question/GET_DAILY_QUESTIONS_SUCCESS';
export const GET_DAILY_QUESTIONS_FAILURE =
  'question/GET_DAILY_QUESTIONS_FAILURE';

export const GET_RANDOM_QUESTIONS = 'question/GET_RANDOM_QUESTIONS';

const initialState = {
  dailyQuestions: [],
  sampleQuestions: [],
  randomQuestions: [],
  recommendedQuestions: [],
  selectedQuestion: {},
  selectedQuestionResponses: []
};

export const getSampleQuestions = () => {
  return (dispatch) => {
    dispatch(getSampleQuestionsSuccess(mockQuestions));
  };
};

export const getSampleQuestionsSuccess = (sampleQuestions) => {
  return {
    type: GET_SAMPLE_QUESTIONS_SUCCESS,
    sampleQuestions
  };
};

export const resetQuestions = () => {
  return {
    type: RESET_QUESTIONS
  };
};

// eslint-disable-next-line no-unused-vars
export const getRecommendedQuestions = (userId) => async (dispatch) => {
  // let res;
  dispatch({ type: 'question/GET_RECOMMENDED_QUESTIONS_REQUEST' });
  try {
    // res = await axios.get(`questions/${userId}`)
  } catch (err) {
    dispatch({
      type: 'question/GET_RECOMMENDED_QUESTIONS_FAILURE',
      error: err
    });
  }
  dispatch({
    type: 'question/GET_RECOMMENDED_QUESTIONS_SUCCESS',
    // recommendedQuestions: res
    res: [...mockRecommendQuestions]
  });
};

export const getDailyQuestions = () => async (dispatch) => {
  // let res;
  dispatch({ type: 'question/GET_DAILY_QUESTIONS_REQUEST' });
  try {
    // res = await axios.get('questions/daily/');
  } catch (err) {
    dispatch({ type: 'question/GET_DAILY_QUESTIONS_FAILURE', error: err });
  }
  dispatch({
    type: 'question/GET_DAILY_QUESTIONS_SUCCESS',
    // dailyQuestions: res
    res: [...mockQuestionFeed]
  });
};

export const getRandomQuestions = () => {
  return {
    type: GET_RANDOM_QUESTIONS
  };
};

export default function questionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SAMPLE_QUESTIONS_SUCCESS: {
      return {
        ...state,
        sampleQuestions: action.sampleQuestions
      };
    }
    case RESET_QUESTIONS: {
      return { ...initialState };
    }
    case GET_RECOMMENDED_QUESTIONS_SUCCESS: {
      return {
        ...state,
        recommendedQuestions: action.res
      };
    }
    case GET_DAILY_QUESTIONS_SUCCESS:
      return {
        ...state,
        dailyQuestions: action.res
      };
    case GET_RANDOM_QUESTIONS:
      const { dailyQuestions } = state;
      const randomQuestions = dailyQuestions
        .sort(() => Math.random() - Math.random())
        .slice(0, 5);
      return {
        ...state,
        randomQuestions
      };
    default:
      return state;
  }
}
