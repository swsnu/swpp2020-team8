import React from 'react';
import { shallow } from 'enzyme';
import ListItemLink from './ListItemLink';

describe('<ListItemLink/>', () => {
  it('should render without errors', () => {
    const component = shallow(<ListItemLink />);
    expect(component.length).toBe(1);
  });
});
