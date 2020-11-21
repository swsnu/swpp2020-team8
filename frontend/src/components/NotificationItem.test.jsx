import React from 'react';
import { shallow } from 'enzyme';
import NotificationItem from './NotificationItem';
import { mockNotifications } from '../constants';

describe('<NotificationItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(
      <NotificationItem notiObj={mockNotifications[0]} />
    );
    expect(component.length).toBe(1);
  });
});
