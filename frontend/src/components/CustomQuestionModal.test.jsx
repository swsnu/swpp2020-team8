/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { shallow } from 'enzyme';
import CustomQuestionModal from './CustomQuestionModal';

describe('<CustomQuestionModal/>', () => {
  it('should render without errors', () => {
    const component = shallow(<CustomQuestionModal />);
    expect(component.length).toBe(1);
  });

  it('should handle input change', () => {
    const handleInputChange = jest.fn();
    const event = {
      preventDefault() {},
      target: { value: 'content' }
    };
    const component = shallow(
      <CustomQuestionModal onChange={handleInputChange} open={true} />
    );
    const textArea = component.find('#new-custom-question');
    textArea.simulate('change', event);
  });

  it('sholud close modal when submit button clicked', () => {
    const mockfn = jest.fn();
    const component = shallow(
      <CustomQuestionModal open={true} handleClose={mockfn} />
    );
    const submitButton = component.find('#submit-button');
    submitButton.simulate('click');
    expect(mockfn).toHaveBeenCalledTimes(1);
  });
});
