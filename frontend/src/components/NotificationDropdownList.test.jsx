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

  it(`should call 'setIsNotiOpen' when click all notification button`, () => {
    const mockFn = jest.fn();
    const component = shallow(
      <NotificationDropdownList
        notifications={mockNotifications}
        setIsNotiOpen={mockFn}
      />
    );
    const allNotiButton = component.find('.all-notifications');

    expect(allNotiButton.length).toBe(1);
    allNotiButton.simulate('click', { stopPropagation: () => undefined });
    expect(mockFn).toHaveBeenCalled();
  });
});
