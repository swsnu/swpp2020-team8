import { shallow } from 'enzyme/build';
import React from 'react';
import QuestionBox from './QuestionBox';

const mockQuestion = {
  id: 1244,
  question: '어디서 마시는 커피를 가장 좋아하는가?'
};

describe('<ArticlePreview />', () => {
  it('should render without errors', () => {
    const component = shallow(<QuestionBox questionObj={mockQuestion} />);
    const wrapper = component.find('Link');
    expect(wrapper.length).toBe(1);
  });
});
