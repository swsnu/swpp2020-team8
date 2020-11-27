/* eslint-disable prefer-promise-reject-errors */
import axios from '../apis';
import store from '../store';
import searchReducer, * as actionCreators from './search';

const userInfo = {
  id: 1,
  password: 'password',
  username: 'user',
  email: 'user@user.com'
};

describe('search Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'fetchSearchResult' should make get call and fetch correctly`, (done) => {
    jest.mock('axios');

    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            count: 1,
            results: [userInfo]
          }
        };
        resolve(result);
      });
    });

    store
      .dispatch(actionCreators.fetchSearchResults(5, userInfo.username))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
        expect(newState.searchReducer.searchObj.results).toMatchObject([
          userInfo
        ]);
        expect(newState.searchReducer.searchObj.totalPages).toEqual(1);
        done();
      });
  });

  it(`'fetchSearchResult' should make get call and fetch correctly`, (done) => {
    jest.mock('axios');

    // axios.get.mockResolvedValue([]);
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            count: 0,
            results: []
          }
        };
        resolve(result);
      });
    });

    store
      .dispatch(actionCreators.fetchSearchResults(5, userInfo.username))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
        expect(newState.searchReducer.searchObj.message).toEqual('');
        done();
      });
  });

  it(`'fetchSearchResult' should make get call and update error when fails`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store
      .dispatch(actionCreators.fetchSearchResults(5, userInfo.username))
      .then(() => {
        const newState = store.getState();
        expect(spy).toHaveBeenCalled();
        expect(newState.searchReducer.searchObj.searchError).toBeTruthy();
        done();
      });
  });

  it('should not make get call when no query', () => {
    store.dispatch(actionCreators.fetchSearchResults(null)).then(() => {
      const newState = store.getState();
      expect(newState.searchReducer.searchObj.results).toMatchObject([]);
      expect(newState.searchReducer.searchObj.message).toBe('');
      expect(newState.searchReducer.searchObj.totalPages).toBe(0);
    });
  });
});

describe('User Reducer', () => {
  it('should return default state', () => {
    const newState = searchReducer(undefined, {}); // initialize
    expect(newState).toEqual({
      searchObj: {
        searchError: false,
        results: [],
        loading: true,
        message: '',
        totalPages: 0,
        currentPageNo: 0,
        numResults: 0
      }
    });
  });

  it('should not change state except loading when GET_SEARCH_RESULTS', () => {
    const newState = searchReducer(
      {
        searchObj: {
          searchError: false,
          results: [],
          loading: true,
          message: '',
          totalPages: 0,
          currentPageNo: 0,
          numResults: 0
        }
      },
      {
        type: actionCreators.GET_SEARCH_RESULTS,
        results: [],
        message: '',
        totalPages: 0,
        loading: false,
        searchError: false,
        numResults: 0
      }
    );
    expect(newState).toMatchObject({
      searchObj: {
        searchError: false,
        results: [],
        loading: false,
        message: '',
        totalPages: 0,
        currentPageNo: 0,
        numResults: 0
      }
    });
  });

  it('should update user info question after selecting question', () => {
    const newState = searchReducer(
      {
        searchObj: {
          searchError: false,
          results: [],
          loading: true,
          message: '',
          totalPages: 0,
          currentPageNo: 0,
          numResults: 0
        }
      },
      {
        type: actionCreators.GET_SEARCH_RESULTS_REQUEST,
        loading: true,
        message: '',
        searchError: false
      }
    );
    expect(newState.searchObj.loading).toEqual(true);
    expect(newState.searchObj.searchError).toEqual(false);
  });

  it('should update error when search fails', () => {
    const newState = searchReducer(
      {
        searchObj: {
          searchError: false,
          results: [],
          loading: true,
          message: '',
          totalPages: 0,
          currentPageNo: 0,
          numResults: 0
        }
      },
      {
        type: actionCreators.GET_SEARCH_RESULTS_FAILURE,
        loading: false,
        searchError: true,
        message: '검색 결과를 찾을 수 없습니다.'
      }
    );
    expect(newState.searchObj.loading).toEqual(false);
    expect(newState.searchObj.searchError).toEqual(true);
    expect(newState.searchObj.message).toEqual('검색 결과를 찾을 수 없습니다.');
  });

  it('should update result when get search results success', () => {
    const newState = searchReducer(
      {
        searchObj: {
          searchError: false,
          results: [],
          loading: true,
          message: '',
          totalPages: 0,
          currentPageNo: 0,
          numResults: 0
        }
      },
      {
        type: actionCreators.GET_SEARCH_RESULTS_SUCCESS,
        results: [userInfo],
        message: 'message',
        totalPages: 1,
        currentPageNo: 1,
        numResults: 1,
        loading: false,
        searchError: false
      }
    );
    const {
      results,
      totalPages,
      currentPageNo,
      numResults,
      loading,
      searchError
    } = newState.searchObj;
    expect(results).toMatchObject([userInfo]);
    expect(totalPages).toEqual(1);
    expect(currentPageNo).toEqual(1);
    expect(numResults).toEqual(1);
    expect(loading).toBeFalsy();
    expect(searchError).toBeFalsy();
  });
});
