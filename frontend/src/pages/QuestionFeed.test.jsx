import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import QuestionFeed from './QuestionFeed';
import rootReducer from '../modules';
import { mockStore } from '../mockStore';
import 'jest-styled-components';
import history from '../history';

jest.mock('../components/posts/QuestionList', () => {
  return jest.fn(() => {
    return <div className="question-list" />;
  });
});

// const observe = jest.fn();
const observe = () => {
  return {
    isIntersecting: true
  };
};
const unobserve = jest.fn();

window.IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve
}));

describe('<QuestionFeed/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionFeed />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    jest.mock('react-redux', () => ({
      useDispatch: () => jest.fn()
    }));

    const wrapper = getWrapper();
    const questionList = wrapper.find('.question-list');
    expect(questionList.length).toBe(1);
  });

  it('should render customQuestionModal when click new-question-button on mobile', () => {
    const wrapper = getWrapper();
    const newQuestion = wrapper.find('#new-question').hostNodes();
    newQuestion.simulate('click');

    const customQuestionModal = wrapper.find('CustomQuestionModal');
    expect(customQuestionModal.length).toBe(1);
  });
});
