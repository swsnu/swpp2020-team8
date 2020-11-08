import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
// import { Router } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';
import { getMockStore } from '../test-utils/mocks';
import history from '../history';
import Login from './Login';

const stubInitialState = { isLoggedIn: false, loginError: 'Error' };
const stubErrorState = { isLoggedIn: false, loginError: 'Error' };
const stubLoggedInState = { isLoggedIn: true };

const mockStore = getMockStore(stubInitialState);
const mockStoreError = getMockStore(stubErrorState);
const mockStoreLoggedIn = getMockStore(stubLoggedInState);

describe('Login', () => {
  let login;
  let spyHistoryPush;
  let spyAxiosPost;

  beforeEach(() => {
    login = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Login history={history} />
        </ConnectedRouter>
      </Provider>
    );

    spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(() => {
      return (dispatch) => {
        dispatch();
      };
    });

    spyAxiosPost = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Login Page should render properly', () => {
    const component = mount(login);
    expect(component.find('Login').length).toBe(1);
  });

  it("should not call 'onLogin' when input is not valid", () => {
    const component = mount(login);
    const wrapper = component.find('#submit-button').at(0);
    wrapper.simulate('click');
    expect(spyAxiosPost).toHaveBeenCalledTimes(0);
  });

  it("should call 'onLogin' when clicked", () => {
    const component = mount(login);
    component
      .find('#email-input')
      .at(0)
      .simulate('change', { target: { value: 'test@gmail.com' } });
    component
      .find('#password-input')
      .at(0)
      .simulate('change', { target: { value: 'test' } });

    const wrapper = component.find('#submit-button').at(0);
    wrapper.simulate('click');
    expect(spyAxiosPost).toHaveBeenCalledTimes(1);
  });

  it('should redirect to /signup', () => {
    const component = mount(login);
    const wrapper = component.find('#signup-button').at(0);
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
    // expect(history.location.pathname).toBe('/signup');
  });

  it('should redirect to /friends when isLoggedIn', () => {
    login = (
      <Provider store={mockStoreLoggedIn}>
        <ConnectedRouter history={history}>
          <Login history={history} />
        </ConnectedRouter>
      </Provider>
    );
    mount(login);
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
    // expect(history.location.pathname).toBe('/friends');
  });

  it('should render WarningMessage', () => {
    login = (
      <Provider store={mockStoreError}>
        <ConnectedRouter history={history}>
          <Login history={history} />
        </ConnectedRouter>
      </Provider>
    );
    const component = mount(login);
    const wrapper = component.find('#login-error-message').at(0);
    expect(wrapper.length).toBe(1);
  });
});
