import Cookies from 'js.cookie';
import axios from 'axios';

jest.mock('axios');

describe('interceptor', () => {
  it('get jwt_token_access when response status is 401', async () => {
    Cookies.set('jwt_token_refresh', 'test_token');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          data: {
            access: 'test_token'
          }
        };
        resolve(result);
      });
    });

    axios.interceptors.response.use = jest.fn((successCb, failCb) => {
      failCb({
        response: {
          status: 401
        },
        config: {
          url: '/home'
        }
      });
    });

    if (Cookies.get('jwt_token_refresh')) {
      const tokenRes = await axios.get('/user/token');
      expect(tokenRes?.data.access).toEqual('test_token');

      expect(spy).toHaveBeenCalled();
    } else {
      const error = () => {
        throw Promise.reject(new Error('error'));
      };
      expect(error).toThrow(Error);
    }
  });
});
