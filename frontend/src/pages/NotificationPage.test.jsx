import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import NotificationPage from './NotificationPage';
import 'jest-styled-components';
import history from '../history';

describe('<NotificationPage /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <NotificationPage />
      </Router>
    </Provider>
  );

  it('NotificationPage Page should mount', async () => {
    const component = wrapper.find('NotificationPage');
    expect(component.length).toBe(1);

    const friendRequests = component.find('FriendItem');
    const notificationItems = component.find('NotificationItem');

    expect(component.length).toBe(1);
    expect(friendRequests.length).toBe(0);
    expect(notificationItems.length).toBe(1);
  });

  it('should handle change tab', async () => {
    let component = wrapper.find('NotificationPage');
    let responseRequestTab = component.find('button').at(2);

    await act(async () => {
      responseRequestTab.simulate('click');
    });
    wrapper.update();

    component = wrapper.find(NotificationPage);
    responseRequestTab = component.find('button').get(2);
  });

  it('should render FriendRequest, RespsonseRequest correctly', async () => {});
});
