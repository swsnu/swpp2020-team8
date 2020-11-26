import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import history from '../history';
import rootReducer from '../modules';
import PostEdit from './PostEdit';
import { mockStore } from '../mockStore';

describe('<PostEdit/>', () => {
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
          <PostEdit />
        </Router>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const questionDetail = wrapper.find('PostEdit');
    expect(questionDetail.length).toBe(1);
  });
});
