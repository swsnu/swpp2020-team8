import axios from '../apis';

export const GET_SEARCH_RESULTS_REQUEST = 'search/GET_SEARCH_RESULTS';
export const GET_SEARCH_RESULTS_SUCCESS = 'search/GET_SEARCH_RESULTS_SUCCESS';
export const GET_SEARCH_RESULTS_FAILURE = 'search/GET_SEARCH_RESULTS_FAILURE';
export const GET_SEARCH_RESULTS_LOAD = 'search/GET_SEARCH_RESULTS_LOAD';

const initialState = {
  searchError: false,
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

  if (!query) {
    dispatch({
      type: 'search/GET_SEARCH_RESULTS_REQUEST',
      results: [],
      message: '',
      totalPages: 0,
      loading: false,
      searchError: false
    });
  } else {
    dispatch({
      query,
      type: 'search/GET_SEARCH_RESULTS_LOAD',
      loading: true,
      message: '',
      searchError: false
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
      loading: false,
      searchError: false
    });
  } catch (err) {
    dispatch({
      type: 'search/GET_SEARCH_RESULTS_FAILURE',
      loading: false,
      searchError: true,
      message: '검색 결과를 찾을 수 없습니다.'
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
        totalPages: action.totalPages,
        searchError: action.searchError
      };
    case GET_SEARCH_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.results,
        message: action.message,
        totalPages: action.totalPages,
        currentPageNo: action.currentPageNo,
        loading: action.loading,
        numResults: action.numResults,
        searchError: action.searchError
      };
    case GET_SEARCH_RESULTS_FAILURE:
      return {
        ...state,
        loading: action.loading,
        message: action.message,
        searchError: action.searchError
      };
    case GET_SEARCH_RESULTS_LOAD:
      return {
        ...state,
        query: action.query,
        loading: action.loading,
        message: action.message,
        searchError: action.searchError
      };
    default:
      return state;
  }
}
