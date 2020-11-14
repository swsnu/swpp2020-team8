import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import 'jest-styled-components';
import history from '../history';
import QuestionListWidget from './QuestionListWidget';

jest.mock('../components/CustomQuestionModal', () => {
  return jest.fn(() => {
    return <div className="custom-question-modal" />;
  });
});

describe('<QuestionListWidget/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionListWidget initialIsFolded={false} />
        </Router>
      </Provider>
    );

  it('should mount Question List Widget', async () => {
    jest.mock('react-redux', () => ({
      useDisPatch: () => jest.fn()
    }));
    const wrapper = getWrapper();
    const postList = wrapper.find('ListItemLink');
    expect(postList.length).toBe(5);
  });

  it('should render without errors', () => {
    const component = getWrapper().find('QuestionListWidget');
    expect(component.length).toBe(1);
  });

  it('should handle fold and unfold button clicks', () => {
    const component = getWrapper();
    const unfoldedButtons = component.find('button');

    // Question: material ui를 id, class로 find하기 =>같은 class를 모두 잡아버림...
    // fold
    const foldButton = unfoldedButtons.at(1);
    foldButton.simulate('click');
    const foldedButtons = component.find('button');
    expect(foldedButtons.length).toEqual(2); // unfold-button, custom-question-button

    // unfold
    const unfoldButton = foldedButtons.at(0);
    unfoldButton.simulate('click');
    expect(component.find('button').length).toEqual(3); // refresh, fold-button, custom-question-button
  });

  it('should call refresh button click', () => {
    const component = getWrapper();
    const questionListWidget = component.find('QuestionListWidget');
    expect(questionListWidget.length).toBe(1);
    const mockfn = jest.fn();
    questionListWidget.handleClickRefreshButton = mockfn;
    const refreshButton = component.find('button').at(0);
    // expect(refreshButton.length).toBe(3);
    refreshButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(0);
  });

  it('should open custom question modal', () => {
    const component = getWrapper();
    const questionButton = component.find('NewQuestionButton');
    expect(questionButton.length).toBe(1);
    questionButton.simulate('click');
    expect(component.find('.custom-question-modal').length).toBe(1);
  });
});
