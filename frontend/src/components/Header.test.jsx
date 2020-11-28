import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore, mockStoreBeforeLogin } from '../mockStore';
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

describe('<Header/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const wrapper = mount(
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
    const header = wrapper.find('Header');
    expect(header.length).toBe(1);
  });

  it('should render <NotificationDropdownList/> when clicking notification button', () => {
    // eslint-disable-next-line react/jsx-boolean-value
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const notiButton = wrapper.find('.noti-button');
    notiButton.at(0).simulate('click', { stopPropagation: () => undefined });
    expect(wrapper.find(NotificationDropdownList)).toHaveLength(1);
  });

  it('should render and call logout when clicked', () => {
    // eslint-disable-next-line react/jsx-boolean-value
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const logout = wrapper.find('#logout-button');
    expect(logout.exists()).toBeTruthy();
    logout.forEach((button) => {
      button.simulate('click');
    });

    setTimeout(() => {
      const dispatch = jest.fn().mockImplementation(() => false);
      expect(dispatch).toBeCalled();
    }, 500);
  });

  it('should render signedInItems not login button', () => {
    const BeforeLoginStore = createStore(
      rootReducer,
      mockStoreBeforeLogin,
      composeWithDevTools(applyMiddleware(thunk))
    );

    const beforeLoginWrapper = mount(
      <Provider store={BeforeLoginStore}>
        <Router history={history}>
          <Header />
        </Router>
      </Provider>
    );

    const loginButton = beforeLoginWrapper.find('#login-link').at(0);
    expect(loginButton).toHaveLength(1);
  });
});
