import React from 'react';
import { shallow } from 'enzyme';
import AnonymousFeed from './AnonymousFeed';

describe('<AnonymousFeed/>', () => {
  it('should render without errors', () => {
    const component = shallow(<AnonymousFeed />);
    const wrapper = component.find('h1');
    expect(wrapper.length).toBe(1);
  });
});
