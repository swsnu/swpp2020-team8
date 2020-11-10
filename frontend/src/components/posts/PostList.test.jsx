import { shallow } from 'enzyme/build';
import React from 'react';
import { mockFriendFeed } from '../../constants';
import PostList from './PostList';

describe('<PostList />', () => {
  it('should render without errors', () => {
    const component = shallow(<PostList posts={mockFriendFeed} />);
    const wrapper = component.find('#post-list');
    expect(wrapper.length).toBe(1);
  });

  it('should change component type depending on the content type', () => {
    const component = shallow(<PostList posts={mockFriendFeed} />);
    const postItem = component.find('PostItem');
    expect(postItem.length).toBe(3);
    const questionItem = component.find('QuestionItem');
    expect(questionItem.length).toBe(1);
  });
});
