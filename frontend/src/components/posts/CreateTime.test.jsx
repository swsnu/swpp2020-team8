import { shallow } from 'enzyme/build';
import React from 'react';
import CreateTime from './CreateTime';

const mockTime = new Date().toISOString();

describe('<ArticlePreview />', () => {
  it('should render without errors', () => {
    const component = shallow(<CreateTime createdTime={mockTime} />);
    const wrapper = component.find('TimeWrapper');
    expect(wrapper.length).toBe(1);
  });
});
