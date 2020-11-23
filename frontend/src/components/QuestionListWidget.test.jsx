/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { mockStore } from '../mockStore';
import rootReducer from '../modules';
import 'jest-styled-components';
import history from '../history';
import QuestionListWidget from './QuestionListWidget';

jest.mock('./CustomQuestionModal', () => {
  return jest.fn((props) => {
    return (
      <div className="custom-question-modal">
        <button className="submit-button" onClick={props.handleClose} />
      </div>
    );
  });
});

describe('<QuestionListWidget/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionListWidget initialIsFolded={false} />
        </Router>
      </Provider>
    );
  });

  it('should mount Question List Widget', async () => {
    jest.mock('react-redux', () => ({
      useDisPatch: () => jest.fn()
    }));
    const postList = wrapper.find('ListItemLink');
    expect(postList.length).toBe(5);
  });

  it('should render without errors', () => {
    const component = wrapper.find('QuestionListWidget');
    expect(component.length).toBe(1);
  });

  it('should handle fold and unfold button clicks', () => {
    // fold
    const foldButton = wrapper.find('ExpandLessIcon').closest('button').at(0);
    foldButton.simulate('click');
    const foldedButtons = wrapper.find('button');
    expect(foldedButtons.length).toEqual(2); // unfold-button, custom-question-button

    // unfold
    const unfoldButton = wrapper.find('ExpandMoreIcon').closest('button').at(0);
    unfoldButton.simulate('click');
    expect(wrapper.find('button').length).toEqual(3); // refresh, fold-button, custom-question-button
  });

  it('should call refresh button click', () => {
    const questionListWidget = wrapper.find('QuestionListWidget');
    expect(questionListWidget.length).toBe(1);
    const mockfn = jest.fn();

    questionListWidget.handleClickRefreshButton = mockfn;
    const refreshButton = wrapper.find('RefreshIcon').closest('button').at(0);
    refreshButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(0);
  });

  it('should open custom question modal', () => {
    const questionButton = wrapper.find('NewQuestionButton');
    expect(questionButton.length).toBe(1);
    questionButton.simulate('click');
    expect(wrapper.find('.custom-question-modal')).toHaveLength(1);
  });

  it('should close custom question modal', async () => {
    const questionButton = wrapper.find('NewQuestionButton');
    expect(wrapper.find('.custom-question-modal')).toHaveLength(0);
    expect(questionButton.length).toBe(1);

    await act(async () => {
      questionButton.simulate('click');
    });
    wrapper.update();

    expect(wrapper.find('.custom-question-modal')).toHaveLength(1);

    const customQuestionSubmitButton = wrapper
      .find('.custom-question-modal')
      .find('.submit-button');

    await act(async () => {
      customQuestionSubmitButton.simulate('click');
    });
    wrapper.update();

    expect(wrapper.find('.custom-question-modal')).toHaveLength(0);
  });
});
