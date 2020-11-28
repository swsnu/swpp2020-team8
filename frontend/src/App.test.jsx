import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import App from './App';
import { mockStore, mockStoreBeforeLogin } from './mockStore';
import rootReducer from './modules';
import history from './history';

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
});
