import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../modules';
import history from '../history';
import { mockStore } from '../mockStore';
import Login from './Login';

describe('<Login /> unit test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Login />
        </Router>
      </Provider>
    );

  it('Login Page should render properly', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('Login').length).toBe(1);
  });

  it('Login Page should mount', async () => {
    const mockClickDone = jest.fn();
    const wrapper = getWrapper();
    const submitButton = wrapper.find('#submit-button').at(0);
    const signupButton = wrapper.find('#signup-button').at(0);

    expect(submitButton.length).toBe(1);
    expect(signupButton.length).toBe(1);
    expect(submitButton.props().disabled).toBe(true);
    submitButton.simulate('click');
    expect(mockClickDone).toHaveBeenCalledTimes(0);
  });

  it('should handle with signup button', async () => {
    const component = getWrapper();
    const emailInput = component.find('#email-input').hostNodes();
    const passwordInput = component.find('#password-input').hostNodes();

    const emailEvent = {
      preventDefault() {},
      target: { name: 'email', value: 'test-email' }
    };
    emailInput.simulate('change', emailEvent);

    const passwordEvent = {
      preventDefault() {},
      target: { name: 'password', value: 'test-password' }
    };
    passwordInput.simulate('change', passwordEvent);

    const signupButton = component.find('#signup-button').at(0);
    signupButton.simulate('click');
    expect(history.location.pathname).toBe('/signup');
  });

  it('should handle with submit button', async () => {
    const component = getWrapper();
    const emailInput = component.find('#email-input').hostNodes();
    const passwordInput = component.find('#password-input').hostNodes();
    const submitButton = component.find('#submit-button').hostNodes();

    const emailEvent = {
      preventDefault() {},
      target: { name: 'email', value: 'test-email' }
    };
    emailInput.simulate('change', emailEvent);

    const passwordEvent = {
      preventDefault() {},
      target: { name: 'password', value: 'test-password' }
    };
    passwordInput.simulate('change', passwordEvent);
    submitButton.simulate('click');
  });
});
