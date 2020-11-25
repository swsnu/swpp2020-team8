// eslint-disable-next-line no-unused-vars
import axios from '../apis';
import {
  mockQuestions,
  // mockQuestionFeed,
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

export const GET_SELECTED_QUESTION_FRIEND_RESPONSES_REQUEST =
  'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_REQUEST';
export const GET_SELECTED_QUESTION_FRIEND_RESPONSES_SUCCESS =
  'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_SUCCESS';
export const GET_SELECTED_QUESTION_FRIEND_RESPONSES_FAILURE =
  'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_FAILURE';

export const GET_SELECTED_QUESTION_RESPONSES_REQUEST =
  'question/GET_SELECTED_QUESTION_RESPONSES_REQUEST';
export const GET_SELECTED_QUESTION_RESPONSES_SUCCESS =
  'question/GET_SELECTED_QUESTION_RESPONSES_SUCCESS';
export const GET_SELECTED_QUESTION_RESPONSES_FAILURE =
  'question/GET_SELECTED_QUESTION_RESPONSES_FAILURE';

const initialState = {
  dailyQuestions: [],
  sampleQuestions: [],
  randomQuestions: [],
  recommendedQuestions: [],
  selectedQuestion: null,
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

// TODO
// export const resetQuestions = () => {
//   return {
//     type: RESET_QUESTIONS
//   };
// };

// TODO: recommendation api 개발 후 주석 제거 및 테스팅 코드 작성 필요
// eslint-disable-next-line no-unused-vars
export const getRecommendedQuestions = (userId) => async (dispatch) => {
  // let res;
  dispatch({ type: 'question/GET_RECOMMENDED_QUESTIONS_REQUEST' });
  // try {
  //   // res = await axios.get(`questions/${userId}`)
  // } catch (err) {
  //   dispatch({
  //     type: 'question/GET_RECOMMENDED_QUESTIONS_FAILURE',
  //     error: err
  //   });
  // }
  dispatch({
    type: 'question/GET_RECOMMENDED_QUESTIONS_SUCCESS',
    // recommendedQuestions: res
    res: [...mockRecommendQuestions]
  });
};

export const getDailyQuestions = () => async (dispatch) => {
  let res;
  dispatch({ type: 'question/GET_DAILY_QUESTIONS_REQUEST' });
  try {
    res = await axios.get('/feed/questions/daily/');
  } catch (err) {
    dispatch({ type: 'question/GET_DAILY_QUESTIONS_FAILURE', error: err });
  }
  dispatch({
    type: 'question/GET_DAILY_QUESTIONS_SUCCESS',
    res: res.data.results
  });
};

export const getRandomQuestions = () => {
  return {
    type: GET_RANDOM_QUESTIONS
  };
};

export const getResponsesByQuestion = (id) => async (dispatch) => {
  let res;
  dispatch({ type: 'question/GET_SELECTED_QUESTION_RESPONSES_REQUEST' });
  try {
    res = await axios.get(`/feed/questions/${id}/`);
  } catch (err) {
    dispatch({
      type: 'question/GET_SELECTED_QUESTION_RESPONSES_FAILURE',
      error: err
    });
  }
  dispatch({
    type: 'question/GET_SELECTED_QUESTION_RESPONSES_SUCCESS',
    res: res.data.response_set,
    question: res.data
  });
};

export const getFriendResponsesByQuestion = (id) => async (dispatch) => {
  let res;
  dispatch({ type: 'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_REQUEST' });
  try {
    res = await axios.get(`/feed/questions/${id}/friend/`);
  } catch (err) {
    dispatch({
      type: 'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_FAILURE',
      error: err
    });
  }
  dispatch({
    type: 'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_SUCCESS',
    res: res.data.response_set,
    question: res.data
  });
};

export default function questionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SAMPLE_QUESTIONS_SUCCESS: {
      return {
        ...state,
        sampleQuestions: action.sampleQuestions
      };
    }
    // TODO
    // case RESET_QUESTIONS: {
    //   return { ...initialState };
    // }
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
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      return {
        ...state,
        randomQuestions
      };
    case GET_SELECTED_QUESTION_RESPONSES_SUCCESS:
      return {
        ...state,
        selectedQuestionResponses: action.res,
        selectedQuestion: action.question
      };
    case GET_SELECTED_QUESTION_FRIEND_RESPONSES_SUCCESS:
      return {
        ...state,
        selectedQuestionResponses: action.res,
        selectedQuestion: action.question
      };
    default:
      return state;
  }
}
