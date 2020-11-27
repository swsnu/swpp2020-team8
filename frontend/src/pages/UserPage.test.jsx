import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import UserPage from './UserPage';
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

describe('<UserPage /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <UserPage />
      </Router>
    </Provider>
  );

  it('NotificationPage Page should mount', async () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const component = wrapper.find('UserPage');
    expect(component.length).toBe(1);

    const name = component.find('h3');
    expect(name.length).toBe(1);
  });

  it('should handle change tab', async () => {
    const component = wrapper.find('UserPage');
    const AllTab = component.find('button').at(0);

    await act(async () => {
      AllTab.simulate('click');
    });
    wrapper.update();
  });

  it('should get userResponses correctly', async () => {
    const component = wrapper.find('UserPage');
    const AllTab = component.find('button').at(0);

    await act(async () => {
      AllTab.simulate('click');
    });
    wrapper.update();

    const userPosts = component.find('UserPostList');
    expect(userPosts.length).toBe(1);
  });
});
