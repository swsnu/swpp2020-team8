import React from 'react';
import { shallow } from 'enzyme';
import QuestionFeed from './QuestionFeed';

describe('<QuestionFeed/>', () => {
  it('should render without errors', () => {
    const component = shallow(<QuestionFeed />);
    const wrapper = component.find('h1');
    expect(wrapper.length).toBe(1);
  });
});
