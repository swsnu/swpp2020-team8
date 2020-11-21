import React from 'react';
import { shallow } from 'enzyme';
import NotificationDropdownList from './NotificationDropdownList';
import { mockNotifications } from '../constants';

describe('<NotificationDropdownList/>', () => {
  it('should render without errors', () => {
    const component = shallow(
      <NotificationDropdownList notifications={mockNotifications} />
    );
    expect(component.length).toBe(1);
  });
});
