/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import history from '../history';
import rootReducer from '../modules';
import QuestionSendModal from './QuestionSendModal';

describe('<QuestionSendModal /> unit test', () => {
  const store = createStore(
    rootReducer,
    {},
    composeWithDevTools(applyMiddleware(thunk))
  );

  const mockfn = jest.fn();
  const mockQuestion = {
    id: 12321,
    content: 'How are you?'
  };

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionSendModal
            questionObj={mockQuestion}
            open={true}
            handleClose={mockfn}
          />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    const component = getWrapper();
    expect(component.find('QuestionSendModal').length).toBe(1);
  });

  it('should close modal when close button clicked', () => {
    const component = getWrapper();
    expect(component.find('QuestionSendModal').length).toBe(1);
    const closeButton = component.find('button').at(0);
    closeButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it('should handle with submit button clicked', () => {
    const component = getWrapper();
    expect(component.find('QuestionSendModal').length).toBe(1);
    const submitButton = component.find('button').at(1);
    submitButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(1);
  });
});
