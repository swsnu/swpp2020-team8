import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reactRedux from 'react-redux';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import 'jest-styled-components';
import history from '../history';
import axios from '../apis';
import MobileSearchPage from './MobileSearchPage';

jest.mock('../components/CustomQuestionModal', () => {
  return jest.fn(() => {
    return <div className="custom-question-modal" />;
  });
});

const mockEmptyStore = {
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
};

jest.mock('../apis');

jest.spyOn(axios, 'get').mockImplementation(() => {
  return new Promise((resolve) => {
    resolve();
  });
});

describe('<MobileSearchPage/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const emptyStore = createStore(
    rootReducer,
    mockEmptyStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MobileSearchPage />
        </Router>
      </Provider>
    );

  it('should mount MobileSearchPage', async () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const wrapper = getWrapper();
    const component = wrapper.find('MobileSearchPage');
    expect(component.length).toBe(1);
  });

  it(`should set state properly on query input`, () => {
    const query = 'TEST_QUERY';
    const component = getWrapper();
    const textField = component.find('#input-search-field').at(0);
    expect(textField.length).toBe(1);
    expect(textField.prop('value')).toEqual('');
    const event = {
      preventDefault() {},
      target: { value: query }
    };
    textField.simulate('change', event);

    component.update();
    // expect(component.find('SearchDropdownList').length).toBeFalsy();
  });

  it('should not render result when no exists', () => {
    const component = mount(
      <Provider store={emptyStore}>
        <Router history={history}>
          <MobileSearchPage />
        </Router>
      </Provider>
    );
    expect(component.find('SearchDropdownList').length).toBe(0);
  });

  it('should render search text field and dispatch when query changes', async () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch');
    const component = getWrapper();
    const searchField = component.find('#input-search-field');
    expect(searchField.length).toBeTruthy();
    const input = searchField.at(1);
    const { value } = input.props();
    expect(value).toEqual('');

    searchField.forEach((item, index) => {
      const changeEvent = {
        target: { value: 'hello' }
      };
      searchField.at(index).simulate('change', changeEvent);
    });
    component.update();
    searchField.at(0).simulate('keydown', {
      key: 'Enter',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    });
    history.push = jest.fn();

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(mockDispatch.mock.calls).toBeTruthy();

    searchField.at(0).simulate('keyDown', { key: 13, keyCode: 13 });
    history.push = jest.fn();

    const searchIcon = component.find('#search-icon');
    searchIcon.at(0).simulate('click');

    component.update();
    expect(component.find('SearchDropdownList')).toBeTruthy();

    component.unmount();
  });
});
