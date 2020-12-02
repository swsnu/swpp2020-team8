import { shallow } from 'enzyme/build';
import React from 'react';
import MobileDrawer from './MobileDrawer';

describe('<MobileDrawer />', () => {
  it('should render without errors', () => {
    const component = shallow(<MobileDrawer />);
    const wrapper = component.find('#drawer-wrapper');
    expect(wrapper.length).toBeTruthy();
  });
});
