import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import PostItem from './PostItem';
import history from '../../history';
import rootReducer from '../../modules';
import { mockStore } from '../../mockStore';

const samplePostObj = {
  id: 0,
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: `ㅋㅋ은 대한민국의 인터넷 신조어로, 한글의 자음 중 하나인 'ㅋ'를 이용해 웃음소리를 표현한 것이다. ㅋㅋ는 의성어인 '큭큭', '킥킥', '캭캭' 등을 초성체로 줄여 쓴 것으로 해석하는 것이 일반적이며, ㅋ자의 빈도와 상황에 따라 여러 가지 의미와 느낌을 줄 수 있다. `,
  created_at: '2020-11-05T14:16:13.801119+08:00',
  like_count: 0,
  current_user_liked: false
};

const sampleResponseObj = {
  id: 4757,
  like_count: 33,
  current_user_liked: true,
  author: {
    profile: {
      id: 123,
      username: 'curious',
      profile_pic:
        'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
    }
  },
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  question: {
    id: 1244,
    question: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  content:
    '스타벅스에서 먹는 바닐라크림콜드브루! 시럽은 1번만 넣고 에스프레소휩을 올리면 행복~',
  created_at: '2020-11-05T14:16:13.801119+08:00',
  comments: [
    {
      id: 1272,
      post_id: 383,
      content: 'fun',
      author_detail: {
        id: 123,
        username: 'curious',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      },
      author: {
        profile: {
          id: 123,
          username: 'curious',
          profile_pic:
            'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
        }
      }
    }
  ]
};

describe('<PostItem /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getPostWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <PostItem postObj={samplePostObj} />
        </Router>
      </Provider>
    );

  const getResponseWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <PostItem id="response" postObj={sampleResponseObj} />
        </Router>
      </Provider>
    );

  it('should render article without errors', () => {
    const component = getPostWrapper();
    const wrapper = component.find('PostItemWrapper');
    expect(wrapper.length).toBe(1);
    const question = component.find('QuestionBox');
    expect(question.length).toBe(0);
    const CreateTime = component.find('CreateTime');
    expect(CreateTime.length).toBe(1);
  });

  it('should render response and question without errors', () => {
    const component = getResponseWrapper();
    const wrapper = component.find('PostItemWrapper');
    expect(wrapper.length).toBe(1);
    const question = component.find('QuestionBox');
    expect(question.length).toBe(1);
  });

  it('should toggle like', async () => {
    const wrapper = getResponseWrapper();

    let component = wrapper.find('#response');
    const likeIcon = component.find('FavoriteBorderIcon');
    const unlikeButton = component.find('FavoriteIcon').closest('button').at(0);
    let likeCount = component.find('#like-count').at(0).text();

    expect(likeIcon.length).toBe(0);
    expect(unlikeButton.length).toBe(1);
    expect(+likeCount).toEqual(sampleResponseObj.like_count);

    // unlike
    await act(async () => {
      unlikeButton.prop('onClick')();
    });

    wrapper.update();

    component = wrapper.find('#response');
    const unlikeIcon = component.find('FavoriteIcon');
    const likeButton = component
      .find('FavoriteBorderIcon')
      .closest('button')
      .at(0);
    likeCount = component.find('#like-count').at(0).text();

    expect(unlikeIcon.length).toBe(0);
    expect(likeButton.length).toBe(1);
    expect(+likeCount).toEqual(sampleResponseObj.like_count - 1);

    // like
    await act(async () => {
      likeButton.simulate('click');
    });

    wrapper.update();

    component = wrapper.find('#response');
    likeCount = component.find('#like-count').at(0).text();

    expect(+likeCount).toEqual(sampleResponseObj.like_count);
  });

  it('should deal with comment submit function', () => {
    const component = getPostWrapper();
    let input = component.find('.comment-input').at(0);
    expect(input).toBeTruthy();
    let submitButton = component.find('#submit-button').at(0);
    expect(submitButton).toBeTruthy();
    submitButton.simulate('click');
    const inputEvent = {
      preventDefault() {},
      target: { value: 'hello' }
    };
    input.simulate('change', inputEvent);
    component.update();
    input = component.find('.comment-input').at(0);
    expect(input.props().value).toEqual('hello');
    submitButton = component.find('#submit-button').at(0);
    submitButton.simulate('click');
    const handleSubmit = jest.fn();
    expect(handleSubmit.mock.calls).toBeTruthy();
  });
});
