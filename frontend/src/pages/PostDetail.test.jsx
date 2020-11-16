import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import PostDetail from './PostDetail';
import QuestionItem from '../components/posts/QuestionItem';
import rootReducer from '../modules';
import { mockStore } from '../mockStore';
import 'jest-styled-components';
import history from '../history';

const mockCustomQuestion = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'true',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

describe('Post Detail Page', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <PostDetail />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const wrapper = getWrapper();
    const postDetail = wrapper.find('PostDetail');
    expect(postDetail.length).toBe(1);
  });

  it('should render question without errors', () => {
    const getWrapperTest = () =>
      mount(
        <Provider store={store}>
          <Router history={history}>
            <PostDetail>
              <QuestionItem questionObj={mockCustomQuestion} />
            </PostDetail>
          </Router>
        </Provider>
      );
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const wrapper = getWrapperTest();
    const postDetail = wrapper.find('QuestionItemWrapper');
    expect(postDetail.length).toBe(1);
  });
});
