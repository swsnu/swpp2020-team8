import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore } from '../../mockStore';
import rootReducer from '../../modules';
import history from '../../history';
import 'jest-styled-components';
import FriendStatusButtons from './FriendStatusButtons';

const mockFriend = {
  id: 123,
  username: 'curious',
  profile_pic:
    'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
};

describe('<FriendStatusButtons /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FriendStatusButtons friendObj={mockFriend} isFriend />
        </Router>
      </Provider>
    );

  const getWrapperWithoutFriend = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FriendStatusButtons friendObj={mockFriend} isFriend={false} />
        </Router>
      </Provider>
    );

  it('component should mount', async () => {
    const wrapper = getWrapper();
    const buttons = wrapper.find('button');
    expect(buttons.length).toBe(2);
    expect(wrapper.find('#friend-status-button')).toBeTruthy();
    expect(wrapper.find('#friend-delete-button')).toBeTruthy();
  });

  it('should work with deleteFriend', async () => {
    const wrapper = getWrapper();
    const buttons = wrapper.find('button');
    expect(buttons.length).toBe(2);
    const deleteButton = wrapper.find('#friend-delete-button').at(0);
    deleteButton.simulate('click');
    const confirmDialog = wrapper.find('AlertDialog');
    expect(confirmDialog).toBeTruthy();

    const confirmButton = wrapper.find('#confirm-button').at(0);
    confirmButton.simulate('click');
    wrapper.update();
    expect(wrapper.find('AlertDialog').at(0).props().isOpen).toBeFalsy();
  });

  it('should work with non-friend', () => {
    const wrapper = getWrapperWithoutFriend();
    const buttons = wrapper.find('button');
    expect(buttons.length).toBe(2);
    expect(wrapper.find('#friend-delete-button').length).toBe(0);
  });

  it('should work with request accept', () => {
    const wrapper = getWrapperWithoutFriend();
    const acceptButton = wrapper.find('#request-accept-button').at(0);
    expect(acceptButton).toBeTruthy();
    acceptButton.simulate('click');
  });
});
