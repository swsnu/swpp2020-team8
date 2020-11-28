import axios from '../apis';
import store from '../store';
import { mockLike } from '../constants';
import * as actionCreators from './like';

describe('likeActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const postInfo = {
    target_type: 'Article',
    target_id: 13
  };

  it(`likePost should like correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: mockLike
        };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.likePost(postInfo)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should dispatch LIKE_POST_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.likePost(postInfo)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it(`unlikePost should unlike correctly`, (done) => {
    const spyGet = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            status: 200,
            results: [mockLike]
          }
        };
        resolve(result);
      });
    });

    const spyDelete = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          status: 301
        };
        resolve(result);
      });
    });

    store.dispatch(actionCreators.unlikePost(postInfo)).then(() => {
      expect(spyGet).toHaveBeenCalledTimes(1);
      expect(spyDelete).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should dispatch UNLIKE_POST_FAILURE when api returns error', async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'delete').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.unlikePost(postInfo)).then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
