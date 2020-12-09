import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import CommentItem from './CommentItem';
import { mockStore } from '../../mockStore';
import rootReducer from '../../modules';
import history from '../../history';
import 'jest-styled-components';

import * as actionCreators from '../../modules/like';

const mockComment = {
  id: 1272,
  post_id: 383,
  content: 'fun',
  author: 1,
  current_user_liked: false,
  like_count: 0,
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  replies: [
    {
      id: 1272,
      content: 'reply',
      current_user_liked: false,
      like_count: 1,
      author: 1,
      author_detail: {
        id: 123,
        username: 'curious',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      }
    },
    {
      id: 123,
      content: 'reply2',
      is_private: true,
      author: 1,
      author_detail: {
        id: 444,
        username: 'rt',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      }
    }
  ]
};

describe('<CommentItem /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CommentItem commentObj={mockComment} isReply={false} />
        </Router>
      </Provider>
    );

  const getReplyWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CommentItem commentObj={mockComment} isReply={false} />
        </Router>
      </Provider>
    );

  it('component should mount', () => {
    const component = getWrapper();
    const wrapper = component.find('CommentItem');
    expect(wrapper.length).toBeTruthy();
    const author = component.find('AuthorProfile');
    expect(author.length).toBeTruthy();
    const replies = component.find('ReplyWrapper');
    expect(replies.length).toBeTruthy();
  });

  it('component should mount when reply', async () => {
    const component = getReplyWrapper();
    const wrapper = component.find('CommentItem');
    expect(wrapper.length).toBeTruthy();
    const author = component.find('AuthorProfile');
    expect(author.length).toBeTruthy();
    const replies = component.find('ReplyWrapper');
    expect(replies).toMatchObject({});
  });
  it('component should mount when reply', async () => {
    const component = getWrapper();
    const wrapper = component.find('CommentItem');
    expect(wrapper.length).toBeTruthy();
    const replies = component.find('.reply-item');
    expect(replies).toBeTruthy();
  });

  it('should not call handleSubmit function when no content change', () => {
    const component = getWrapper();
    const replyWrapper = component.find('ReplyWrapper').last();
    replyWrapper.simulate('click');
    component.update();
    const newComment = component.find('NewComment').last();
    expect(newComment).toBeTruthy();
    const submitButton = component.find('#submit-button').last();
    expect(submitButton).toBeTruthy();
    newComment.find('#submit-button').last().simulate('click');
    submitButton.simulate('click');
    expect(jest.fn().mock.calls.length).toEqual(0);
  });

  it('should handle with delete comment when clicking delete icon', () => {
    const component = getWrapper();
    const commentLength = component.find('CommentItem').length;
    expect(commentLength).toBeTruthy();
    const deleteButton = component.find('#delete-comment-icon').first();
    deleteButton.simulate('click');
    component.update();
  });

  it('should not display private item', () => {
    const component = getWrapper();
    const commentLength = component.find('.reply-item').length;
    expect(commentLength).toBeLessThanOrEqual(mockComment.replies.length * 2);
  });

  it('should toggle like', async () => {
    const component = getWrapper();
    const likeButton = component.find('.like').at(0);
    let unlikeButton = component.find('.unlike').at(0);
    const likeCount = component.find('#like-count');
    expect(likeButton).toBeTruthy();
    expect(unlikeButton.length).toBe(0);

    const toggleLike = jest
      .spyOn(actionCreators, 'likePost')
      .mockImplementation(() => {
        return () => {};
      });

    await act(async () => {
      likeButton.simulate('click');
    });

    expect(toggleLike).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 500));
    component.update();

    unlikeButton = component.find('.unlike').at(0);
    expect(unlikeButton).toBeTruthy();

    const toggleUnlike = jest
      .spyOn(actionCreators, 'unlikePost')
      .mockImplementation(() => {
        return () => {};
      });

    unlikeButton = component.find('.unlike').at(0);
    await act(async () => {
      unlikeButton.simulate('click');
    });

    expect(toggleUnlike).toHaveBeenCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(likeCount).toMatchObject({});
  });
});
