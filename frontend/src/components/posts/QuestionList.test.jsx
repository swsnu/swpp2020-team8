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

  it('should display spinner when is appending', () => {
    const component = shallow(
      <QuestionList questions={mockQuestionFeed} isAppending />
    );
    const spinner = component.find('#spinner');
    expect(spinner).toBeTruthy();
  });
});
