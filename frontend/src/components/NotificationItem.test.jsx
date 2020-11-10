import React from 'react';
import { shallow } from 'enzyme';
import NotificationItem from './NotificationItem';

describe('<NotificationItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(<NotificationItem />);
    expect(component.length).toBe(1);
  });
});
