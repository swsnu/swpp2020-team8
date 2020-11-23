import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import 'jest-styled-components';
import history from '../history';
import FriendListWidget from './FriendListWidget';

describe('Friend List Widget unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FriendListWidget />
        </Router>
      </Provider>
    );

  it('Friend List Widget should mount', async () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));

    const wrapper = getWrapper();
    const widget = wrapper.find('#friend-list-widget');
    expect(widget).toBeTruthy();
  });
});
