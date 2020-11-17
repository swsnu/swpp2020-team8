import { shallow } from 'enzyme/build';
import React from 'react';
import CommentItem from './CommentItem';

const mockComment = {
  id: 1272,
  post_id: 383,
  content: 'fun',
  author: 1,
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  }
};

describe('<CreateTime />', () => {
  it('should render without errors', () => {
    const component = shallow(<CommentItem commentObj={mockComment} />);
    const wrapper = component.find('CommentItem');
    expect(wrapper.length).toBe(1);
    const author = component.find('AuthorProfile');
    expect(author.length).toBe(1);
  });
  it('should render content correctly', () => {
    const component = shallow(<CommentItem commentObj={mockComment} />);
    const content = component.find('#comment-content');
    expect(content.text()).toBe('fun');
  });
});
