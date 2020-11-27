import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import FriendFeed from './FriendFeed';
import 'jest-styled-components';
import history from '../history';

jest.mock('../components/posts/PostList', () => {
  return jest.fn(() => {
    return <div className="post-list" />;
  });
});
const observe = jest.fn();
const unobserve = jest.fn();

window.IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve
}));

describe('<FriendFeed /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FriendFeed />
        </Router>
      </Provider>
    );

  it('FriendFeed Page should mount', async () => {
    jest.mock('react-redux', () => ({
      // useSelector: jest.fn((fn) => fn()),
      useDispatch: () => jest.fn()
    }));

    const wrapper = getWrapper();
    const postList = wrapper.find('.post-list');
    expect(postList.length).toBe(1);
    // expect(img).toHaveStyleRule('width', '30px');
    expect(observe.mock.calls).toBeTruthy();
  });
});
