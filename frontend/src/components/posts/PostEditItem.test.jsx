import React from 'react';
import { shallow } from 'enzyme';
import PostEditItem from './PostEditItem';
import { mockPost } from '../../constants';

describe('<PostEditItem />', () => {
  it('should render without errors', () => {
    const component = shallow(<PostEditItem postObj={mockPost} />);
    expect(component).toHaveLength(1);
  });
});
