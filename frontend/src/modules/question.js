import { mockQuestions } from '../constants';

export const GET_SAMPLE_QUESTIONS = 'question/GET_SAMPLE_QUESTIONS';
export const GET_SAMPLE_QUESTIONS_SUCCESS =
  'question/GET_SAMPLE_QUESTIONS_SUCCESS';
export const RESET_QUESTIONS = 'question/RESET_QUESTIONS';

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
    setTimeout(() => {
      dispatch(getSampleQuestionsSuccess(mockQuestions));
    }, 1000);
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
    default:
      return state;
  }
}
