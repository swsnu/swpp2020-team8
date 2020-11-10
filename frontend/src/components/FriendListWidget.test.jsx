import React from 'react';
import { shallow } from 'enzyme';
import FriendListWidget from './FriendListWidget';

describe('<FriendFriendListWidgetItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(<FriendListWidget />);
    expect(component.length).toBe(1);
  });
});
