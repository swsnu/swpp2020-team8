import { shallow } from 'enzyme/build';
import React from 'react';
import { mockQuestionFeed } from '../../constants';
import QuestionList from './QuestionList';

describe('<QuestionList />', () => {
  it('should render without errors', () => {
    const component = shallow(<QuestionList questions={mockQuestionFeed} />);
    const wrapper = component.find('#question-list');
    expect(wrapper.length).toBe(1);
  });
});
