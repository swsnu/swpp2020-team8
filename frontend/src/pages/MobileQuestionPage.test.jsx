import React from 'react';
import { shallow } from 'enzyme';
import MobileQuestionPage from './MobileQuestionPage';

describe('<MobileQuestionPage/>', () => {
  it('should render without errors', () => {
    const component = shallow(<MobileQuestionPage />);
    expect(component.length).toBe(1);
  });
});
