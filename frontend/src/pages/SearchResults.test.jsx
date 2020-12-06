/* eslint-disable no-unused-vars */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import SearchResults from './SearchResults';
import rootReducer from '../modules';
import history from '../history';
import { mockStore } from '../mockStore';
import * as actionCreators from '../modules/user';

describe('<SearchResults /> unit test', () => {
  const mStore = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const failStore = createStore(
    rootReducer,
    {
      ...mockStore,
      searchReducer: {
        searchObj: {
          searchError: false,
          results: [],
          loading: false,
          message: '',
          totalPages: 0,
          currentPageNo: 0,
          numResults: 0
        }
      }
    },
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={mStore}>
        <Router history={history}>
          <SearchResults />
        </Router>
      </Provider>
    );

  it('SearchResults should mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('SearchResults').length).toBe(1);
    expect(wrapper.find('FriendListWrapper')).toBeTruthy();
    expect(wrapper.find('FriendItem')).toBeTruthy();
    expect(wrapper.find('PageNavigation')).toBeTruthy();
  });

  it('should pass props to page navigation correctly', () => {
    const wrapper = getWrapper();
    const pageNav = wrapper.find('PageNavigation');
    const props = pageNav.at(0).props();
    expect(props.totalPages).toBe(3);
    expect(props.showPrevLink).toBeTruthy();
    expect(props.showNextLink).toBeTruthy();
    expect(props.handlePrevClick).toBeTruthy();
    expect(props.handleNextClick).toBeTruthy();
  });

  it('should trigger handle page click when next button clicked', () => {
    const wrapper = getWrapper();
    const dispatch = jest.fn();
    const nextButton = wrapper.find('.next-button').at(0);
    expect(nextButton).toBeTruthy();
    nextButton.simulate('click');
    expect(dispatch.mock.calls).toBeTruthy();
  });

  it('should dispatch when loading', () => {
    const wrapper = mount(
      <Provider store={failStore}>
        <Router history={history}>
          <SearchResults />
        </Router>
      </Provider>
    );

    expect(wrapper.find('h2')).toBeTruthy();
  });
});

describe('<SearchResults /> unit test', () => {
  const mStore = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={mStore}>
        <Router history={history}>
          <SearchResults />
        </Router>
      </Provider>
    );

  it('should trigger handle page click when prev button clicked', () => {
    const wrapper = getWrapper();
    const dispatch = jest.fn();
    const nextButton = wrapper.find('.prev-button').at(0);
    expect(nextButton).toBeTruthy();
    nextButton.simulate('click');
    expect(dispatch.mock.calls).toBeTruthy();
  });

  const failStore = createStore(
    rootReducer,
    {
      ...mockStore,
      searchReducer: {
        searchObj: {
          searchError: true,
          results: [{ user: 1 }, { user: 2 }],
          loading: false,
          message: 'message',
          totalPages: 0,
          currentPageNo: 0,
          numResults: 0
        }
      }
    },
    composeWithDevTools(applyMiddleware(thunk))
  );

  it('should display error message when search Error is true', () => {
    const wrapper = mount(
      <Provider store={failStore}>
        <Router history={history}>
          <SearchResults />
        </Router>
      </Provider>
    );
    expect(wrapper.find('.message')).toBeTruthy();
  });
});
