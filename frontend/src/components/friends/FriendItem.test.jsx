import React from 'react';
import { shallow, mount } from 'enzyme';
import { Router } from 'react-router-dom';

import FriendItem from './FriendItem';
import history from '../../history';
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
    // const component = shallow(<FriendItem friendObj={mockFriend} isWidget />);
    const component = mount(
      <Router history={history}>
        <FriendItem friendObj={mockFriend} isWidget />
      </Router>
    );
    expect(component.length).toBe(1);
    const wrapper = component.find('FriendItemWrapper').at(0);
    history.push = jest.fn();
    wrapper.simulate('click');

    expect(wrapper).toHaveStyleRule('margin', '8px 16px');
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
