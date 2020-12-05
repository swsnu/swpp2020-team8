import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import NotificationDropdownList from './NotificationDropdownList';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import history from '../history';

describe('<NotificationDropdownList/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const mockFn = jest.fn();
  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <NotificationDropdownList
          setIsNotiOpen={mockFn}
          readAllNotification={mockFn}
        />
      </Router>
    </Provider>
  );

  it('should render without errors', () => {
    const component = wrapper.find('NotificationDropdownList');
    expect(component.length).toBe(1);
  });

  it(`should call 'setIsNotiOpen' when click all notification button`, () => {
    const component = wrapper.find('NotificationDropdownList');
    const allNotiButton = component.find('.all-notifications');

    expect(allNotiButton.length).toBe(1);
    allNotiButton.simulate('click', { stopPropagation: () => undefined });
    expect(mockFn).toHaveBeenCalled();
  });

  it(`should call 'handleReadAllNotification' when click read all notification button`, () => {
    const component = wrapper.find('NotificationDropdownList');
    const allNotiButton = component.find('.read-all-notifications');

    expect(allNotiButton.length).toBe(1);
    allNotiButton.simulate('click', { stopPropagation: () => undefined });
    expect(mockFn).toHaveBeenCalled();
  });

  it('should not render buttons when notifications are empty', () => {
    const emptyNotiWrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationDropdownList
            setIsNotiOpen={mockFn}
            readAllNotification={mockFn}
            notifications={[]}
          />
        </Router>
      </Provider>
    );

    const component = emptyNotiWrapper.find('NotificationDropdownList');
    const buttons = component.find('button');
    expect(buttons.length).toBe(1);
  });
});
