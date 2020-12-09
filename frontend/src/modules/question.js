// eslint-disable-next-line no-unused-vars
import axios from '../apis';
import { mockQuestions } from '../constants';

export const APPEND_QUESTIONS_REQUEST = 'post/APPEND_QUESTIONS_REQUEST';
export const APPEND_QUESTIONS_SUCCESS = 'post/APPEND_QUESTIONS_SUCCESS';
export const APPEND_QUESTIONS_FAILURE = 'post/APPEND_QUESTIONS_FAILURE';

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

export const GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_REQUEST =
  'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_REQUEST';
export const GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_SUCCESS =
  'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_SUCCESS';
export const GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_FAILURE =
  'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_FAILURE';

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

export const GET_RESPONSE_REQUESTS_REQUEST =
  'question/GET_RESPONSE_REQUESTS_REQUEST';
export const GET_RESPONSE_REQUESTS_SUCCESS =
  'question/GET_RESPONSE_REQUESTS_SUCCESS';
export const GET_RESPONSE_REQUESTS_FAILURE =
  'question/GET_RESPONSE_REQUESTS_FAILURE';

export const CREATE_RESPONSE_REQUEST_REQUEST =
  'question/CREATE_RESPONSE_REQUEST_REQUEST';
export const CREATE_RESPONSE_REQUEST_SUCCESS =
  'question/CREATE_RESPONSE_REQUEST_SUCCESS';
export const CREATE_RESPONSE_REQUEST_FAILURE =
  'question/CREATE_RESPONSE_REQUEST_FAILURE';

export const DELETE_RESPONSE_REQUEST_REQUEST =
  'question/DELETE_RESPONSE_REQUEST_REQUEST';
export const DELETE_RESPONSE_REQUEST_SUCCESS =
  'question/DELETE_RESPONSE_REQUEST_SUCCESS';
export const DELETE_RESPONSE_REQUEST_FAILURE =
  'question/DELETE_RESPONSE_REQUEST_FAILURE';

const initialState = {
  dailyQuestions: [],
  sampleQuestions: [],
  randomQuestions: [],
  recommendedQuestions: [],
  selectedQuestion: null,
  selectedQuestionResponses: [],
  selectedQuestionResponseRequests: [],
  next: null
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
  let res;
  dispatch({ type: 'question/GET_RECOMMENDED_QUESTIONS_REQUEST' });
  try {
    res = await axios.get(`feed/questions/daily/recommended/`);
  } catch (error) {
    dispatch({
      type: 'question/GET_RECOMMENDED_QUESTIONS_FAILURE',
      error
    });
    return;
  }
  const { data } = res;
  dispatch({
    type: 'question/GET_RECOMMENDED_QUESTIONS_SUCCESS',
    res: data.results
  });
};

export const getDailyQuestions = () => async (dispatch) => {
  let res;
  dispatch({ type: 'question/GET_DAILY_QUESTIONS_REQUEST' });
  try {
    res = await axios.get('/feed/questions/daily/');
  } catch (error) {
    dispatch({ type: 'question/GET_DAILY_QUESTIONS_FAILURE', error });
    return;
  }
  dispatch({
    type: 'question/GET_DAILY_QUESTIONS_SUCCESS',
    res: res?.data.results,
    next: res?.data.next
  });
};

export const appendDailyQuestions = () => async (dispatch, getState) => {
  const { next } = getState().questionReducer;
  if (!next) return;
  const nextUrl = next.replace('http://localhost:8000/api/', '');
  let result;
  dispatch({ type: APPEND_QUESTIONS_REQUEST });
  try {
    result = await axios.get(nextUrl);
  } catch (error) {
    dispatch({ type: APPEND_QUESTIONS_FAILURE, error });
    return;
  }
  dispatch({
    type: APPEND_QUESTIONS_SUCCESS,
    questions: result?.data.results,
    next: result?.data.next
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
  } catch (error) {
    dispatch({
      type: 'question/GET_SELECTED_QUESTION_RESPONSES_FAILURE',
      error
    });
    return;
  }
  dispatch({
    type: 'question/GET_SELECTED_QUESTION_RESPONSES_SUCCESS',
    res: res?.data?.response_set,
    question: res?.data
  });
};

export const getAnonymousResponsesByQuestion = (id) => async (dispatch) => {
  let res;
  dispatch({
    type: 'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_REQUEST'
  });
  try {
    res = await axios.get(`/feed/questions/${id}/anonymous/`);
  } catch (error) {
    dispatch({
      type: 'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_FAILURE',
      error
    });
    return;
  }
  dispatch({
    type: 'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_SUCCESS',
    res: res?.data?.response_set,
    question: res?.data
  });
};

export const getFriendResponsesByQuestion = (id) => async (dispatch) => {
  let res;
  dispatch({ type: 'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_REQUEST' });
  try {
    res = await axios.get(`/feed/questions/${id}/friend/`);
  } catch (error) {
    dispatch({
      type: 'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_FAILURE',
      error
    });
    return;
  }
  dispatch({
    type: 'question/GET_SELECTED_QUESTION_FRIEND_RESPONSES_SUCCESS',
    res: res?.data?.response_set,
    question: res?.data
  });
};

export const getResponseRequestsByQuestion = (id) => async (dispatch) => {
  let res;
  dispatch({ type: 'question/GET_RESPONSE_REQUESTS_REQUEST' });
  try {
    res = await axios.get(`/feed/questions/${id}/response-request/`);
  } catch (error) {
    dispatch({
      type: 'question/GET_RESPONSE_REQUESTS_FAILURE',
      error
    });
    return;
  }
  dispatch({
    type: 'question/GET_RESPONSE_REQUESTS_SUCCESS',
    res: res?.data
  });
};

export const createResponseRequest = (responseRequestObj) => async (
  dispatch
) => {
  let res;
  dispatch({ type: 'question/CREATE_RESPONSE_REQUEST_REQUEST' });
  try {
    res = await axios.post(
      `/feed/questions/response-request/`,
      responseRequestObj
    );
  } catch (error) {
    dispatch({
      type: 'question/CREATE_RESPONSE_REQUEST_FAILURE',
      error
    });
    return;
  }
  dispatch({
    type: 'question/CREATE_RESPONSE_REQUEST_SUCCESS',
    res: res?.data
  });
  dispatch(getResponseRequestsByQuestion(responseRequestObj.question_id));
};

export const deleteResponseRequest = (qid, rid) => async (dispatch) => {
  let res;
  dispatch({ type: 'question/DELETE_RESPONSE_REQUESTS_REQUEST' });
  try {
    res = await axios.delete(`/feed/questions/${qid}/response-request/${rid}/`);
  } catch (error) {
    dispatch({
      type: 'question/DELETE_RESPONSE_REQUESTS_FAILURE',
      error
    });
    return;
  }
  dispatch({
    type: 'question/DELETE_RESPONSE_REQUESTS_SUCCESS',
    res: res?.data
  });
  dispatch(getResponseRequestsByQuestion(qid));
};

export default function questionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DAILY_QUESTIONS_REQUEST: {
      return {
        ...state,
        dailyQuestions: []
      };
    }
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
        dailyQuestions: action.res,
        next: action.next
      };
    case APPEND_QUESTIONS_REQUEST:
      return {
        ...state,
        next: null
      };
    case APPEND_QUESTIONS_SUCCESS:
      return {
        ...state,
        dailyQuestions: [...state.dailyQuestions, ...action.questions],
        next: action.next
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
    case GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES_SUCCESS:
      return {
        ...state,
        selectedQuestionResponses: action.res,
        selectedQuestion: action.question
      };
    case GET_RESPONSE_REQUESTS_SUCCESS:
      return {
        ...state,
        selectedQuestionResponseRequests: action.res
      };
    case GET_RESPONSE_REQUESTS_FAILURE:
      return {
        ...state,
        selectedQuestionResponseRequests: []
      };
    default:
      return state;
  }
}
