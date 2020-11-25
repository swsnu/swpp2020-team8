import axios from '../apis';

export const GET_SEARCH_RESULTS_REQUEST = 'search/GET_SEARCH_RESULTS';
export const GET_SEARCH_RESULTS_SUCCESS = 'search/GET_SEARCH_RESULTS_SUCCESS';
export const GET_SEARCH_RESULTS_FAILURE = 'search/GET_SEARCH_RESULTS_FAILURE';
export const GET_SEARCH_RESULTS_LOAD = 'search/GET_SEARCH_RESULTS_LOAD';

const initialState = {
  results: [],
  loading: true,
  message: '',
  totalPages: 0,
  currentPageNo: 0,
  numResults: 0
};

export const getPageCount = (total, denominator) => {
  const divisible = total % denominator === 0;
  const valueToBeAdded = divisible ? 0 : 1;
  return Math.floor(total / denominator) + valueToBeAdded;
};

export const fetchSearchResults = (updatedPageNo = '', query) => async (
  dispatch
) => {
  const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
  const searchUrl = `user/search/?query=${query}${pageNumber}`;

  let result;

  console.log('=================');
  console.log(query);

  if (!query) {
    dispatch({
      type: 'search/GET_SEARCH_RESULTS_REQUEST',
      results: [],
      message: '',
      totalPages: 0,
      loading: false
    });
  } else {
    console.log('why>');
    dispatch({
      type: 'search/GET_SEARCH_RESULTS_LOAD',
      loading: true,
      message: ''
    });
  }

  try {
    result = await axios.get(searchUrl, {});
    const total = result.data.count;
    const totalPagesCount = getPageCount(total, 15);
    const resultNotFoundMsg =
      !result.data.results.length && total > 0
        ? '검색 결과는 이게 끝입니다?'
        : '';
    dispatch({
      type: 'search/GET_SEARCH_RESULTS_SUCCESS',
      results: result?.data.results,
      message: resultNotFoundMsg,
      totalPages: totalPagesCount,
      currentPageNo: updatedPageNo,
      numResults: total,
      loading: false
    });
    console.log(totalPagesCount);
    console.log(updatedPageNo);
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: 'search/GET_SEARCH_RESULTS_FAILURE',
      loading: false,
      message: '검색 결과를 가져오지 못했습니다. 인터넷 연결 상태를 확인하세요?'
    });
  }
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SEARCH_RESULTS_REQUEST:
      return {
        ...state,
        loading: action.loading,
        message: action.message,
        results: action.results,
        totalPages: action.totalPages
      };
    case GET_SEARCH_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.results,
        message: action.message,
        totalPages: action.totalPages,
        currentPageNo: action.currentPageNo,
        loading: action.loading,
        numResults: action.numResults
      };
    case GET_SEARCH_RESULTS_FAILURE:
      return {
        ...state,
        loading: action.loading,
        message: action.message
      };
    case GET_SEARCH_RESULTS_LOAD:
      return {
        ...state,
        loading: action.loading,
        message: action.message
      };
    default:
      return state;
  }
}
