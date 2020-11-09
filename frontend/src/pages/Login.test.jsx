import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

describe('<Login/>', () => {
  it('should render without errors', () => {
    const component = shallow(<Login />);
    const wrapper = component.find('h1');
    expect(wrapper.length).toBe(1);
  });
});
