import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import axios from '../apis';
import rootReducer from '../modules';
import history from '../history';
import { mockStore } from '../mockStore';
import SignUp from './SignUp';

describe('Sign up page unit test', () => {
  jest.mock('axios');

  // axios.get.mockResolvedValue([]);
  jest.spyOn(axios, 'post').mockImplementation(() => {
    return new Promise((resolve) => {
      const result = { data: {} };
      resolve(result);
    });
  });

  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <SignUp />
        </Router>
      </Provider>
    );

  it('SignUp Page should mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('SignUp').length).toBe(1);
  });

  it('should work with input change', async () => {
    const component = getWrapper();
    const emailInput = component.find('#email-input').at(0);
    const usernameInput = component.find('#username-input').at(0);
    const pwInput = component.find('#password-input').at(0);
    const emailEvent = {
      preventDefault() {},
      target: { name: 'email', value: 'hello' }
    };
    emailInput.simulate('change', emailEvent);
    const usernameEvent = {
      preventDefault() {},
      target: { name: 'username', value: 'hello' }
    };
    usernameInput.simulate('change', usernameEvent);
    const pwEvent = {
      preventDefault() {},
      target: { name: 'password', value: 'hello' }
    };
    pwInput.simulate('change', pwEvent);
    const submitButton = component.find('button').first();
    submitButton.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 500));
    // expect(component.find('WarningMessage').length)
  });

  it('SignUp Page should mount', async () => {
    const wrapper = getWrapper();
    const submitButton = wrapper.find('button').first();
    expect(submitButton.length).toBeTruthy();
    expect(submitButton.props().disabled).toBe(true);
    submitButton.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it('should redirect to login page when clicking login button', () => {
    const wrapper = getWrapper();
    const loginButton = wrapper.find('#login-button');
    expect(loginButton).toBeTruthy();
    loginButton.at(1).simulate('click');
    history.push = jest.fn().mockImplementation(() => false);
  });
});
