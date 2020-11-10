import React from 'react';
import { shallow } from 'enzyme';
import FriendItem from './FriendItem';

describe('<FriendItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(<FriendItem username="username" />);
    expect(component.length).toBe(1);
  });
});
