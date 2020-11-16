import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import 'jest-styled-components';
import history from '../history';
import Header from './Header';
import NotificationDropdownList from './NotificationDropdownList';

jest.mock('../components/CustomQuestionModal', () => {
  return jest.fn(() => {
    return <div className="custom-question-modal" />;
  });
});

describe('<QuestionListWidget/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Header />
        </Router>
      </Provider>
    );

  it('should mount Question List Widget', async () => {
    jest.mock('react-redux', () => ({
      useDisPatch: () => jest.fn()
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
  });

  it('should render and call logout when clicked', () => {
    // eslint-disable-next-line react/jsx-boolean-value
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const component = getWrapper();
    const logout = component.find('#logout-button');
    expect(logout.exists()).toBeTruthy();
    logout.forEach((button) => {
      button.simulate('click');
    });

    setTimeout(() => {
      const dispatch = jest.fn().mockImplementation(() => false);
      expect(dispatch).toBeCalled();
    }, 500);
  });
});
