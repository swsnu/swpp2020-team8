import loadingReducer from './loading';

describe('questionActions', () => {
  it('should redirect login', () => {
    const newState = loadingReducer(
      {},
      {
        type: 'user/GET_CURRENT_USER_FAILURE'
      }
    );

    expect(newState['user/GET_CURRENT_USER']).toBe('FAILURE');
  });
});
