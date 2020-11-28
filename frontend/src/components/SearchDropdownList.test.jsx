/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import history from '../history';
import rootReducer from '../modules';
import SearchDropdownList from './SearchDropdownList';
import { mockStore } from '../mockStore';

describe('<SearchDropdownList /> unit test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <SearchDropdownList />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    const component = getWrapper();
    expect(component.find('SearchDropdownList').length).toBe(1);
  });

  it('should display result as friend item', () => {
    const component = getWrapper();
    expect(component.find('FriendItem')).toBeTruthy();
  });
});
