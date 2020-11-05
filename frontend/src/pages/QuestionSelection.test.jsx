import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import QuestionSelection from './QuestionSelection';
import rootReducer from '../modules';
import history from '../history';
import { mockStore } from '../mockStore';

describe('<QuestionSelection /> unit test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionSelection />
        </Router>
      </Provider>
    );

  it('QuestionSelection should mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('QuestionSelection').length).toBe(1);
  });

  it('should work with question select', async () => {
    const wrapper = getWrapper();
    history.push = jest.fn().mockImplementation(() => false);
    const question = wrapper.find('.question-item').at(0);
    expect(question.length).toBe(1);
    question.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 500));
    question.simulate('click');
  });
});
