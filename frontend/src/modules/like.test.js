import axios from '../apis';
import store from '../store';
import { mockLike } from '../constants';
import * as actionCreators from './like';

describe('likeActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`likePost should like correctly`, (done) => {
    jest.mock('axios');

    const postInfo = {
      target_type: 'Article',
      target_id: 13
    };

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

  it(`unlikePost should unlike correctly`, (done) => {
    const postInfo = {
      target_type: 'Article',
      target_id: 13
    };

    const spyGet = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            status: 200,
            results: mockLike
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
});
