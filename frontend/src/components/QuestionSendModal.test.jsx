/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import history from '../history';
import rootReducer from '../modules';
import QuestionSendModal from './QuestionSendModal';
import { mockStore, mockNoFriendStore } from '../mockStore';
import { mockFriendList } from '../constants';

describe('<QuestionSendModal /> unit test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const mockfn = jest.fn();
  const mockQuestion = {
    id: 12321,
    content: 'How are you?'
  };

  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionSendModal
            questionObj={mockQuestion}
            open={true}
            handleClose={mockfn}
          />
        </Router>
      </Provider>
    );
  });

  it('should render without errors', () => {
    expect(wrapper.find('QuestionSendModal').length).toBe(1);
  });

  it('should close modal when close button clicked', () => {
    expect(wrapper.find('QuestionSendModal').length).toBe(1);
    const closeButton = wrapper.find('button').at(0);
    closeButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it('should handle with delete response request', async () => {
    const QuestionSendFriendItem = wrapper.find('QuestionSendFriendItem');
    expect(QuestionSendFriendItem).toHaveLength(mockFriendList.length);
  });

  it('should render NoFriend when current user have no friends', () => {
    const noFriendStore = createStore(
      rootReducer,
      mockNoFriendStore,
      composeWithDevTools(applyMiddleware(thunk))
    );

    const noFriendWrapper = mount(
      <Provider store={noFriendStore}>
        <Router history={history}>
          <QuestionSendModal
            questionObj={mockQuestion}
            open={true}
            handleClose={mockfn}
          />
        </Router>
      </Provider>
    );

    const noFriend = noFriendWrapper.find('NoFriend');
    expect(noFriend.length).toBe(1);
    const friendItem = noFriendWrapper.find('QuestionSendFriendItem');
    expect(friendItem.length).toBe(0);
  });
});
