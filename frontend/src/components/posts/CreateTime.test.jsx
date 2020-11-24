import { shallow } from 'enzyme/build';
import React from 'react';
import CreateTime from './CreateTime';

const mockTime = new Date().toISOString();

describe('<CreateTime />', () => {
  it('should render without errors', () => {
    jest.useFakeTimers();
    const component = shallow(<CreateTime createdTime={mockTime} />);
    const wrapper = component.find('TimeWrapper');
    expect(wrapper.length).toBe(1);
    jest.advanceTimersByTime(30000);
    component.update();
  });
});
