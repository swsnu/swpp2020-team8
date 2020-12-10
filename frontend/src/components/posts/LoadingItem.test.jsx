import { shallow } from 'enzyme/build';
import React from 'react';
import LoadingItem from './LoadingItem';

describe('<LoadingItem />', () => {
  it('should render without errors', () => {
    const component = shallow(<LoadingItem />);
    const wrapper = component.find('#skeleton-circle');
    expect(wrapper.length).toBeTruthy();
  });
});
