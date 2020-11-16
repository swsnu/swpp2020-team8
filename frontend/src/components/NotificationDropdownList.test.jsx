import React from 'react';
import { shallow } from 'enzyme';
import NotificationDropdownList from './NotificationDropdownList';

describe('<NotificationDropdownList/>', () => {
  it('should render without errors', () => {
    const component = shallow(<NotificationDropdownList />);
    expect(component.length).toBe(1);
  });
});
