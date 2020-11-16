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
import CustomQuestionModal from './CustomQuestionModal';

describe('<CustomQuestionModal /> unit test', () => {
  const store = createStore(
    rootReducer,
    {},
    composeWithDevTools(applyMiddleware(thunk))
  );

  const mockfn = jest.fn();

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CustomQuestionModal open={true} handleClose={mockfn} />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    const component = getWrapper();
    expect(component.find('CustomQuestionModal').length).toBe(1);
  });

  it('should close modal when submit button clicked', () => {
    const component = getWrapper();
    expect(component.find('CustomQuestionModal').length).toBe(1);
    const submitButton = component.find('button');
    submitButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  it('should handle input change', () => {
    const component = getWrapper();
    expect(component.find('CustomQuestionModal').length).toBe(1);
    const textarea = component.find('textarea').at(0);

    const event = {
      preventDefault() {},
      target: { name: 'username', value: 'test' }
    };
    textarea.simulate('change', event);
  });
});
