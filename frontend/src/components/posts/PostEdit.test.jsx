import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import PostEdit from './PostEdit';
import rootReducer from '../../modules';
import history from '../../history';
import { mockStore } from '../../mockStore';

describe('<PostEdit />', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );
  const onChange = jest.fn();
  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <PostEdit onChange={onChange} />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('PostEdit').length).toBe(1);
  });

  it('should handle with input change properly', () => {
    const wrapper = getWrapper();
    const input = wrapper.find('#new-post-input').at(0);
    expect(input.length).toBe(1);
    expect(input.prop('value')).toEqual(
      '사람들의 무리한 부탁을 잘 거절하는 편'
    );
    const event = {
      preventDefault() {},
      target: { name: 'content', value: 'test' }
    };
    input.simulate('change', event);
  });
});
