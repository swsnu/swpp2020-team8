import React from 'react';
import { shallow } from 'enzyme';
import FriendItem from './FriendItem';
import 'jest-styled-components';

const mockFriend = {
  id: 1,
  username: 'test'
};
describe('<FriendItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(<FriendItem friendObj={mockFriend} />);
    expect(component.length).toBe(1);
  });

  it('should change margin when isWidget is true', () => {
    const component = shallow(<FriendItem friendObj={mockFriend} isWidget />);
    expect(component.length).toBe(1);
    const wrapper = component.find('FriendItemWrapper').at(0);
    expect(wrapper).toHaveStyleRule('margin', 'auto');
  });

  it('should change margin when isWidget is false', () => {
    const component = shallow(
      <FriendItem friendObj={mockFriend} isWidget={false} />
    );
    expect(component.length).toBe(1);
    const wrapper = component.find('FriendItemWrapper').at(0);
    expect(wrapper).toHaveStyleRule('margin', '8px 0');
  });
});
