import React from 'react';
import { shallow } from 'enzyme';
import QuestionListWidget from './QuestionListWidget';

describe('<QuestionListWidget/>', () => {
  it('should render without errors', () => {
    const component = shallow(<QuestionListWidget />);
    expect(component.length).toBe(1);
  });

  it('should handle fold and unfold button clicks', () => {
    const component = mount(<QuestionListWidget initialIsFolded={false} />);
    const unfoldedButtons = component.find('button');

    // Question: material ui를 id, class로 find하기 =>같은 class를 모두 잡아버림...
    // fold
    const foldButton = unfoldedButtons.at(1);
    foldButton.simulate('click');
    const foldedButtons = component.find('button');
    expect(foldedButtons.length).toEqual(2); // unfold-button, custom-question-button

    // unfold
    const unfoldButton = foldedButtons.at(0);
    unfoldButton.simulate('click');
    expect(component.find('button').length).toEqual(3); // refresh, fold-button, custom-question-button
  });
});
