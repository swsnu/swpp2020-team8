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

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CustomQuestionModal open={true} />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    const component = getWrapper();
    expect(component.find('CustomQuestionModal').length).toBe(1);
  });
});
