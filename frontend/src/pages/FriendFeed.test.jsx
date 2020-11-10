import React from 'react';
import { shallow } from 'enzyme';
import FriendFeed from './FriendFeed';

describe('<FriendFeed/>', () => {
  it('should render without errors', () => {
    const component = shallow(<FriendFeed />);
    const wrapper = component.find('Article');
    expect(wrapper.length).toBe(1);
  });
});
