import { mount } from 'enzyme';
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import NewPost from './NewPost';
import history from '../../history';
import rootReducer from '../../modules';

describe('<NewPost />', () => {
  const mockStore = {
    friendReducer: {},
    notiReducer: {},
    postReducer: {},
    questionReducer: {},
    userReducer: {},
    loadingReducer: {}
  };

  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NewPost value="content" />
        </Router>
      </Provider>
    );

  it('should render without errors', async () => {
    const wrapper = getWrapper();
    expect(wrapper.find('NewPost').length).toBe(1);
  });

  it('should handle with input change properly', async () => {
    const onChange = jest.fn();
    const wrapper = shallow(<NewPost onChange={onChange} />);
    const input = wrapper.find('#new-post-input').at(0);
    expect(input.length).toBe(1);
    expect(input.prop('value')).toEqual('');
    const event = {
      preventDefault() {},
      target: { name: 'content', value: 'test' }
    };
    input.simulate('change', event);
  });
});
