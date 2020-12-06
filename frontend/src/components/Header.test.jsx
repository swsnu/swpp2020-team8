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
import Header from './Header';
import NotificationDropdownList from './NotificationDropdownList';

jest.mock('../components/CustomQuestionModal', () => {
  return jest.fn(() => {
    return <div className="custom-question-modal" />;
  });
});

jest.mock('../apis');

jest.spyOn(axios, 'get').mockImplementation(() => {
  return new Promise((resolve) => {
    resolve();
  });
});

const setRefreshToken = jest.fn();

describe('<Header/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Header isMobile={false} setRefreshToken={setRefreshToken} />
        </Router>
      </Provider>
    );

  const getMobileWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Header isMobile />
        </Router>
      </Provider>
    );

  it('should mount Header', async () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const wrapper = getWrapper();
    const header = wrapper.find('Header');
    expect(header.length).toBe(1);
  });

  it('should render <NotificationDropdownList/> when clicking notification button', () => {
    // eslint-disable-next-line react/jsx-boolean-value
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const component = getWrapper();
    const notiButton = component.find('.noti-button');
    notiButton.at(0).simulate('click', { stopPropagation: () => undefined });
    expect(component.find(NotificationDropdownList)).toHaveLength(1);

    component
      .find('div')
      .at(0)
      .simulate('click', { stopPropagation: () => undefined });
    expect(component.find(NotificationDropdownList)).toMatchObject({});
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

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(mockDispatch.mock.calls).toBeTruthy();

    searchField.at(0).simulate('keyDown', { key: 13, keyCode: 13 });
    history.push = jest.fn();

    component.update();
    expect(component.find('SearchDropdownList')).toBeTruthy();

    component.unmount();
  });

  it('should render and toggle drawer when mobile', () => {
    const component = getMobileWrapper();
    component.update();
    const drawerButton = component.find('#drawer-open-button');
    expect(drawerButton.length).toBeTruthy();
    drawerButton.at(0).simulate('click');
    component.update();
    expect(component.find('MobileDrawer')).toBeTruthy();
    component.find('#mask').at(0).simulate('click');
    expect(drawerButton.length).toBeTruthy();
  });
  it('should render and call logout when clicked', () => {
    // eslint-disable-next-line react/jsx-boolean-value
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch');
    const component = getWrapper();
    const logout = component.find('#logout-button');
    expect(logout.exists()).toBeTruthy();
    logout.forEach((button) => {
      button.simulate('click');
    });

    setTimeout(() => {
      expect(mockDispatch).toBeCalled();
    }, 500);
    component.unmount();
  });
});
