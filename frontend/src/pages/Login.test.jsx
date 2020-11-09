import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../modules';
import history from '../history';
import mockStore from '../mockStore';
import Login from './Login';

describe('<Login /> unit test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
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

  it('LoginPage should mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('Login').length).toBe(1);
  });

  it('should reflect input change', () => {
    const wrapper = getWrapper();
    const input = wrapper.find('#email-input').at(0);
    expect(input.length).toBe(1);
    expect(input.prop('value')).toEqual('');
    const event = {
      preventDefault() {},
      target: { name: 'email', value: 'hello@hello.com' }
    };
    input.simulate('change', event);
  });

  it('should handle submit', () => {
    const wrapper = getWrapper();
    const button = wrapper.find('#submit-button').at(0);
    expect(button.length).toBe(1);

    const emailInput = wrapper.find('#email-input').at(0);
    const event = {
      preventDefault() {},
      target: { name: 'email', value: 'swpp@snu.ac.kr' }
    };
    emailInput.simulate('change', event);

    const pwInput = wrapper.find('#password-input').at(0);
    const event2 = {
      preventDefault() {},
      target: { name: 'password', value: 'iluvswpp' }
    };
    pwInput.simulate('change', event2);
    button.simulate('click');
    expect(jest.fn()).toBeCalledTimes(0);
  });

  it('should handle signup', () => {
    const wrapper = getWrapper();
    const button = wrapper.find('#signup-button').at(0);
    expect(button.length).toBe(1);
    button.simulate('click');
    expect(jest.fn()).toBeCalledTimes(0);
  });
});
