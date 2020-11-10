import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import history from '../history';

const getMockReducer = jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  }
);


export const getMockStore = (userState) => {
  const mockUserReducer = getMockReducer(userState);

  const rootReducer = combineReducers({
    user: mockUserReducer,
    router: connectRouter(history)
  });

  const mockStore = createStore(
    rootReducer,
    applyMiddleware(thunk, routerMiddleware(history))
  );

  return mockStore;
};


export default getMockStore;

