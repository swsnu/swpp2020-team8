import { mount } from 'enzyme';
import React from 'react';
import { Router } from 'react-router-dom';
import history from '../history';
import NewPost from './NewPost';

describe('<NewPost />', () => {
  const getWrapper = () =>
    mount(
      <Router history={history}>
        <NewPost value="content" />
      </Router>
    );

  it('should render without errors', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('NewPost').length).toBe(1);
  });

  it('should handle with input change properly', () => {
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
