import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';
import NotificationDropdownList from './NotificationDropdownList';

describe('<Header/>', () => {
  it('should render without errors', () => {
    const component = shallow(<Header />);
    expect(component.length).toBe(1);
  });

  it('should render <NotificationDropdownList/> when clicking notification button', () => {
    // eslint-disable-next-line react/jsx-boolean-value
    const component = shallow(<Header signedIn={true} />);
    const notiButton = component.find('.noti-button');
    notiButton.simulate('click', { stopPropagation: () => undefined });
    expect(component.find(NotificationDropdownList)).toHaveLength(1);
  });
});