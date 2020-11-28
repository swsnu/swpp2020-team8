import { shallow } from 'enzyme/build';
import React from 'react';
import LoadingList from './LoadingList';

describe('<LoadingList />', () => {
  it('should render without errors', () => {
    const component = shallow(<LoadingList />);
    const wrapper = component.find('#skeleton-circle');
    expect(wrapper.length).toBeTruthy();
  });
});
