import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router, MemoryRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import Cookies from 'js.cookie';
import App from './App';
import { mockStore, mockStoreBeforeLogin } from './mockStore';
import rootReducer from './modules';
import history from './history';
import axios from './apis';
import * as actionCreators from './modules/user';

import { mockNotifications } from './constants';

describe('App unit mount test', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const storeBeforeLogin = createStore(
    rootReducer,
    mockStoreBeforeLogin,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );

  it('should mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('App').length).toBe(1);
  });

  it('should display login button when not logged in', () => {
    const wrapper = mount(
      <Provider store={storeBeforeLogin}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
    expect(wrapper.find('#login-link')).toBeTruthy();
  });

  it('should get current user when refresh token is set', () => {
    let wrapper = getWrapper();
    let refresh_token = Cookies.get('jwt_token_refresh');
    const mockUser = {
      id: 4,
      username: 'aa',
      email: 'aa@aa.aa',
      profile_pic: '#30FE0A',
      question_history: '[4,6,8]',
      url: 'http://localhost:8000/api/user/4/'
    };
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          status: 200,
          data: mockUser
        };
        resolve(result);
      });
    });

    if (refresh_token) {
      expect(spy).toHaveBeenCalled();
    }

    wrapper.unmount();
    wrapper = getWrapper();

    refresh_token = Cookies.set('jwt_token_refresh', 'test_token');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get notifications when change location', (done) => {
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          status: 200,
          data: mockNotifications
        };
        resolve(result);
      });
    });

    const wrapper = getWrapper();
    wrapper.unmount();

    const newState = store.getState();
    if (newState.userReducer.currentUser) {
      expect(spy).toHaveBeenCalled();
    } else {
      expect(spy).toHaveBeenCalledTimes(0);
    }

    done();
  });

  it('should redirect select questions when select question of current user is null', (done) => {
    const signedInWrapper = () =>
      mount(
        <MemoryRouter initialEntries={['/signup']}>
          <Provider store={store}>
            <App />
          </Provider>
        </MemoryRouter>
      );

    const wrapper = signedInWrapper();
    let appHistory = wrapper.find('Router').prop('history');
    expect(appHistory.location.pathname).toBe('/select-questions');

    const spy = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });

    store.dispatch(actionCreators.postSelectedQuestions('[1]')).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();

      expect(newState.userReducer.currentUser.question_history).toEqual('[1]');

      history.push('/signup');
      wrapper.update();
      if (newState.userReducer.currentUser.question_history) {
        appHistory = wrapper.find('Router').prop('history');
        done();
      }
    });
  });
});
