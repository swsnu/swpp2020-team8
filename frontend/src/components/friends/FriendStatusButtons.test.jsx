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

const userObj = {
  id: 13,
  username: 'curie',
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
          <FriendStatusButtons friendObj={userObj} isFriend />
        </Router>
      </Provider>
    );

  const getAllWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FriendStatusButtons
            friendObj={userObj}
            isFriend={false}
            isPending={false}
            hasSentRequest={false}
            requestId={7}
          />
          <FriendStatusButtons
            friendObj={userObj}
            isFriend={false}
            isPending
            hasSentRequest={false}
            requestId={10}
          />
          <FriendStatusButtons
            friendObj={userObj}
            isFriend={false}
            isPending={false}
            hasSentRequest
            requestId={7}
          />
          <FriendStatusButtons
            friendObj={userObj}
            isFriend
            isPending={false}
            hasSentRequest={false}
            requestId={7}
          />
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
    // expect(wrapper.find('AlertDialog').at(0).props().isOpen).toBeFalsy();
  });

  it('should work with not want to deleteFriend', async () => {
    const wrapper = getWrapper();
    const buttons = wrapper.find('button');
    expect(buttons.length).toBe(2);
    const deleteButton = wrapper.find('#friend-delete-button').at(0);
    deleteButton.simulate('click');
    const confirmDialog = wrapper.find('AlertDialog');
    expect(confirmDialog).toBeTruthy();

    const confirmButton = wrapper.find('#cancel-button').at(1);
    confirmButton.simulate('click');
    wrapper.update();
    expect(wrapper.find('AlertDialog').at(0).props().isOpen).toBeFalsy();
  });

  it('should work with every type of friend', () => {
    const wrapper = getAllWrapper();
    const buttons = wrapper.find('button');
    expect(buttons.length).toBeTruthy();
    expect(wrapper.find('#friend-delete-button')).toBeTruthy();
    const friendStatusButton = wrapper.find('#friend-status-button');
    const friendDeleteButton = wrapper.find('#friend-delete-button');
    const requestAcceptButton = wrapper.find('#request-accept-button');
    const requestDeleteButton = wrapper.find('#request-delete-button');
    requestDeleteButton.at(0).first().simulate('click');
    const onClickDeleteRequestButton = jest.fn();
    expect(onClickDeleteRequestButton.mock.calls).toBeTruthy();
    const hasSentRequestButton = wrapper.find('#has-sent-request-button');
    const sentRequestDeleteButton = wrapper.find('#sent-request-delete-button');
    const requestFriendButton = wrapper.find('#request-friend-button');
    expect(friendStatusButton).toBeTruthy();
    expect(friendDeleteButton).toBeTruthy();
    expect(requestAcceptButton).toBeTruthy();
    expect(requestDeleteButton).toBeTruthy();
    expect(hasSentRequestButton).toBeTruthy();
    expect(sentRequestDeleteButton).toBeTruthy();

    expect(requestFriendButton).toBeTruthy();
    requestFriendButton.at(0).simulate('click');
    const onClickRequestFriendButton = jest.fn();
    requestAcceptButton.at(0).simulate('click');
    expect(onClickRequestFriendButton.mock.calls).toBeTruthy();
    wrapper.update();
    const onClickDeleteFriendButton = jest.fn();
    friendDeleteButton.at(0).simulate('click');
    expect(onClickDeleteFriendButton.mock.calls).toBeTruthy();
    wrapper.find('#confirm-button').at(0).simulate('click');
    const onConfirmDeleteFriend = jest.fn();
    expect(onConfirmDeleteFriend.mock.calls).toBeTruthy();

    expect(requestFriendButton).toMatchObject({});
  });

  it('should work with button click', () => {
    const wrapper = getAllWrapper();
    const deleteRequestButton = wrapper.find('#sent-request-delete-button');
    expect(deleteRequestButton.length).toBeTruthy();

    const acceptRequestButton = wrapper.find('#request-accept-button');
    expect(acceptRequestButton.length).toBeTruthy();

    deleteRequestButton.at(0).simulate('click');
    acceptRequestButton.at(0).simulate('click');

    wrapper.update();
    expect(wrapper.find('#request-friend-button')).toBeTruthy();
  });
});
