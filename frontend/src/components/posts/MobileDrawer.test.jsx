import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { Router } from 'react-router';
import history from '../../history';
import MobileDrawer from './MobileDrawer';

describe('<MobileDrawer />', () => {
  it('should render without errors', () => {
    const component = shallow(<MobileDrawer />);
    const wrapper = component.find('#drawer-wrapper');
    expect(wrapper.length).toBeTruthy();
  });

  it('should work with tab click', () => {
    const handleDrawerClose = jest.fn();
    const onLogout = jest.fn();
    const component = mount(
      <Router history={history}>
        <MobileDrawer
          open
          onLogout={onLogout}
          handleDrawerClose={handleDrawerClose}
        />
      </Router>
    );
    history.push = jest.fn();

    const listItems = component.find('ListItem');
    for (let i = 0; i < listItems.length; i += 1) {
      listItems.at(i).simulate('click');
    }

    expect(onLogout.mock.calls.length).toBeTruthy();

    const questionButton = component.find('#question');
    const searchButton = component.find('#search');
    const friendButton = component.find('#friend');

    questionButton.at(0).simulate('click');
    searchButton.at(0).simulate('click');
    friendButton.at(0).simulate('click');

    expect(handleDrawerClose.mock.calls.length).toBeTruthy();
  });
});
