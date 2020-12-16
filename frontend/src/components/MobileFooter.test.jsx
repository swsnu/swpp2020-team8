import React from 'react';
import { Router } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import MobileFooter from './MobileFooter';
import history from '../history';

Object.defineProperty(window, 'location', {
  value: {
    pathname: '/questions'
  }
});
const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
describe('<MobileFooter/>', () => {
  it('should render without errors', () => {
    const component = shallow(<MobileFooter />);
    expect(component.length).toBe(1);
    const links = component.find('.link');
    expect(links.length).toBe(5);
  });

  it('should move to link when clicked', () => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        push: jest.fn()
      })
    }));

    const component = mount(
      <Router history={historyMock}>
        <MobileFooter />
      </Router>
    );

    const links = component.find('.link');
    expect(links.length).toBeTruthy();

    history.push = jest.fn();

    links.at(0).simulate('click');
    for (let i = 0; i < links.length; i += 1) {
      links.at(i).simulate('click');
    }

    const nav = component.find('#bottom-nav');
    nav.at(0).simulate('change', ',', '/');
  });
});
