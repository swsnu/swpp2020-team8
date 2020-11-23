/* eslint-disable no-unused-vars */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import QuestionSelection from './QuestionSelection';
import rootReducer from '../modules';
import history from '../history';
import { mockStore } from '../mockStore';
import * as actionCreators from '../modules/user';

describe('<QuestionSelection /> unit test', () => {
  const mStore = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={mStore}>
        <Router history={history}>
          <QuestionSelection />
        </Router>
      </Provider>
    );
  });

  it('QuestionSelection should mount', () => {
    expect(wrapper.find('QuestionSelection').length).toBe(1);
  });

  it('should work with question select', async () => {
    history.push = jest.fn().mockImplementation(() => false);
    const question = wrapper.find('.question-item').at(0);
    expect(question.length).toBe(1);
    question.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 500));
    question.simulate('click');
  });

  it('should dispatch `postSelectedQuestions` when click submit button', async () => {
    const submitButton = wrapper.find('CommonButton');
    const questionItem = wrapper.find('QuestionItem').at(0);
    const postSelectedQuestions = jest
      .spyOn(actionCreators, 'postSelectedQuestions')
      .mockImplementation(() => {
        return (dispatch) => {};
      });

    await act(async () => {
      questionItem.simulate('click');
    });
    await act(async () => {
      submitButton.simulate('click');
    });

    expect(postSelectedQuestions).toHaveBeenCalledTimes(1);
  });

  it('should dispatch `skipSelectQuestions` when click submit button', async () => {
    const skipButton = wrapper.find('CustomLink');

    const skipSelectQuestions = jest
      .spyOn(actionCreators, 'skipSelectQuestions')
      .mockImplementation(() => {
        return (dispatch) => {};
      });

    await act(async () => {
      skipButton.simulate('click');
    });

    expect(skipSelectQuestions).toHaveBeenCalledTimes(1);
  });
});
