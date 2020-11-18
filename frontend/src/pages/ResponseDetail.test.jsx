import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ResponseDetail from './ResponseDetail';
import PostItem from '../components/posts/PostItem';
import rootReducer from '../modules';
import { mockStore } from '../mockStore';
import 'jest-styled-components';
import history from '../history';

const mockResponse = {
  id: 5999,
  'content-type': 'Response',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  question: 1244,
  question_detail: {
    id: 1244,
    content: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  content:
    '스타벅스에서 먹는 바닐라크림콜드브루! 시럽은 1번만 넣고 에스프레소휩을 올리면 행복~',
  comments: [
    {
      id: 1274,
      post_id: 383,
      content: '오 마져 맛이써!!!!',
      author: 3,
      author_detail: {
        id: 2,
        profile_pic:
          'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png',
        username: '아이폰'
      },
      referenced_comments: 1274,
      is_reply: false,
      is_private: true,
      create_dt: '2020-09-23T10:40:42.268355+08:00',
      update_dt: '2020-09-23T10:40:42.268384+08:00'
    }
  ],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

describe('Response Detail Page', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ResponseDetail />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const wrapper = getWrapper();
    const postDetail = wrapper.find('ResponseDetail');
    expect(postDetail.length).toBe(1);
  });

  it('should render article without errors', () => {
    const getWrapperTest = () =>
      mount(
        <Provider store={store}>
          <Router history={history}>
            <ResponseDetail>
              <PostItem postObj={mockResponse} />
            </ResponseDetail>
          </Router>
        </Provider>
      );
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));
    const wrapper = getWrapperTest();
    const postDetail = wrapper.find('PostItemWrapper');
    expect(postDetail.length).toBe(1);
  });
});
