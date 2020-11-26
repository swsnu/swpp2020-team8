import React from 'react';
import { shallow } from 'enzyme';
import PostEditItem from './PostEditItem';
import { mockPost, mockResponse } from '../../constants';

describe('<PostEditItem />', () => {
  it('should render without errors', () => {
    const component = shallow(<PostEditItem postObj={mockPost} />);
    expect(component).toHaveLength(1);
  });

  it('should render QuestionBox when post type is response', async () => {
    const component = shallow(<PostEditItem postObj={mockResponse} />);
    expect(component).toHaveLength(1);
    const questionBox = component.find('QuestionBox');
    expect(questionBox.length).toBe(1);
  });

  it('should handle with input change properly', async () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <PostEditItem postObj={mockPost} onChange={onChange} />
    );
    let input = wrapper.find('#edit-post-input');
    expect(input.length).toBe(1);
    expect(input.prop('value')).toEqual(mockPost.content);
    const event = {
      preventDefault() {},
      target: { name: 'content', value: 'test' }
    };
    input.simulate('change', event);

    wrapper.update();
    input = wrapper.find('#edit-post-input');
    expect(input.prop('value')).toEqual('test');
  });
});
