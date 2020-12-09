import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
// import { act } from 'react-dom/test-utils';
import history from '../history';
import rootReducer from '../modules';
import QuestionDetail from './QuestionDetail';
import { mockStore } from '../mockStore';

const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

window.IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve,
  disconnect
}));

describe('<QuestionDetail/>', () => {
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
          <QuestionDetail />
        </Router>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const questionDetail = wrapper.find('QuestionDetail');
    expect(questionDetail.length).toBe(1);
  });
});
