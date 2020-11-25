import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import history from '../history';
import rootReducer from '../modules';
import QuestionDetail from './QuestionDetail';
import { mockStore } from '../mockStore';

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

  it('should toggle view anonymous switch', async () => {
    let questionDetail = wrapper.find('QuestionDetail');
    let switchComponent = questionDetail.find('input').at(0);

    await act(async () => {
      switchComponent.simulate('change', { target: { checked: true } });
    });

    wrapper.update();
    questionDetail = wrapper.find('QuestionDetail');
    switchComponent = questionDetail.find('input').at(0);
    expect(switchComponent.props().checked).toBe(true);
  });
});
