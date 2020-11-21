import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import NotificationPage from './NotificationPage';
import 'jest-styled-components';
import history from '../history';

describe('<NotificationPage /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <NotificationPage />
      </Router>
    </Provider>
  );

  it('NotificationPage Page should mount', async () => {
    const postList = wrapper.find('NotificationPage');
    expect(postList.length).toBe(1);
  });
});
