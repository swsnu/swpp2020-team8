import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
// import { getMockStore } from '../test-utils/mocks';
import rootReducer from '../modules';
import history from '../history';
import { mockStore } from '../mockStore';
import Login from './Login';

// const stubStateLoginError = {
//   error: true,
//   user: { id: 1, username: 'jina', isLoggedIn: false }
// };
const mockErrorStore = {
  ...mockStore,
  userReducer: {
    loginError: '401',
    error: false,
    user: {
      id: 0,
      username: 'mock',
      isLoggedIn: false
    }
  }
};

describe('<Login /> unit test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const errStore = createStore(
    rootReducer,
    mockErrorStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const handleSubmit = jest.fn();
  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Login handleSubmit={handleSubmit} />
        </Router>
      </Provider>
    );

  const getErrorWrapper = () =>
    mount(
      <Provider store={errStore}>
        <Router history={history}>
          <Login handleSubmit={handleSubmit} />
        </Router>
      </Provider>
    );

  it('LoginPage should mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('Login').length).toBe(1);
  });

  it('should reflect input change', () => {
    const wrapper = getWrapper();
    const input = wrapper.find('#username-input').at(0);
    expect(input.length).toBe(1);
    expect(input.prop('value')).toEqual('');
    const event = {
      preventDefault() {},
      target: { name: 'username', value: 'test' }
    };
    input.simulate('change', event);
  });

  it('should handle submit', () => {
    const wrapper = getWrapper();
    const button = wrapper.find('#submit-button').at(0);
    expect(button.length).toBe(1);

    const usernameInput = wrapper.find('#username-input').at(0);
    const event = {
      preventDefault() {},
      target: { name: 'username', value: 'test' }
    };
    usernameInput.simulate('change', event);

    const pwInput = wrapper.find('#password-input').at(0);
    const event2 = {
      preventDefault() {},
      target: { name: 'password', value: 'test' }
    };
    pwInput.simulate('change', event2);
    button.simulate('click');
    expect(jest.fn()).toBeCalledTimes(0);
  });

  it('should handle login when enter key pressed on usernameInput', () => {
    const wrapper = getWrapper();

    const usernameInput = wrapper.find('#username-input').at(0);
    const event = {
      preventDefault() {},
      target: { name: 'username', value: 'test' }
    };
    usernameInput.simulate('change', event);

    const pwInput = wrapper.find('#password-input').at(0);
    const event2 = {
      preventDefault() {},
      target: { name: 'password', value: 'test' }
    };
    pwInput.simulate('change', event2);
    usernameInput.simulate('keyDown', { keyCode: 13 });
    expect(jest.fn()).toBeCalledTimes(0);
  });

  it('should handle login when enter key pressed on pwInput', () => {
    const wrapper = getWrapper();

    const usernameInput = wrapper.find('#username-input').at(0);
    const event = {
      preventDefault() {},
      target: { name: 'username', value: 'test' }
    };
    usernameInput.simulate('change', event);

    const pwInput = wrapper.find('#password-input').at(0);
    const event2 = {
      preventDefault() {},
      target: { name: 'password', value: 'test' }
    };
    pwInput.simulate('change', event2).simulate('keyDown', { keyCode: 13 });
    expect(jest.fn()).toBeCalledTimes(0);
  });

  it('should handle login when enter key pressed on pwInput', () => {
    const wrapper = getWrapper();

    const usernameInput = wrapper.find('#username-input').at(0);
    const event = {
      preventDefault() {},
      target: { name: 'username', value: 'test' }
    };
    usernameInput.simulate('change', event);

    const pwInput = wrapper.find('#password-input').at(0);
    const event2 = {
      preventDefault() {},
      target: { name: 'password', value: 'test' }
    };
    pwInput.simulate('change', event2).simulate('keyDown', { keyCode: 12 });
    expect(jest.fn()).toBeCalledTimes(0);
  });

  it('should handle signup', () => {
    const wrapper = getWrapper();
    const button = wrapper.find('#signup-button').at(0);
    expect(button.length).toBe(1);
    button.simulate('click');
    expect(jest.fn()).toBeCalledTimes(0);
  });

  it('warning message should not appear', () => {
    const wrapper = getWrapper();
    const msg = wrapper.find('WarningMessage');
    expect(msg.length).toBe(0);
  });

  it('warning message should appear when error', () => {
    const wrapper = getErrorWrapper();
    const msg = wrapper.find('WarningMessage');
    expect(msg.length).toBe(1);
  });
});
