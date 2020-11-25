import { shallow } from 'enzyme/build';
import React from 'react';
import NewComment from './NewComment';

const onSubmit = jest.fn();
describe('<NewComment />', () => {
  it('should render without errors', () => {
    const component = shallow(
      <NewComment onSubmit={onSubmit} isReply={false} />
    );
    const wrapper = component.find('NewCommentWrapper');
    expect(wrapper.length).toBe(1);
  });

  it('should render icon when is reply', () => {
    const component = shallow(<NewComment onSubmit={onSubmit} isReply />);
    const wrapper = component.find('NewCommentWrapper');
    expect(wrapper.length).toBe(1);

    const icon = component.find('SubdirectoryArrowRightIcon');
    expect(icon).toBeTruthy();
  });

  it('should render icon when is reply', async () => {
    const component = shallow(<NewComment onSubmit={onSubmit} isReply />);
    const wrapper = component.find('NewCommentWrapper');
    expect(wrapper.length).toBe(1);
    let input = component.find('.comment-input');
    expect(input).toBeTruthy();
    let submitButton = component.find('#submit-button');
    expect(submitButton).toBeTruthy();
    submitButton.simulate('click');
    const inputEvent = {
      preventDefault() {},
      target: { value: 'hello' }
    };
    input.simulate('change', inputEvent);
    component.update();
    input = component.find('.comment-input');
    expect(input.props().value).toEqual('hello');
    submitButton = component.find('#submit-button');
    submitButton.simulate('click');
  });

  it('should recognize enter key press when is comment', () => {
    const component = shallow(
      <NewComment onSubmit={onSubmit} isReply={false} />
    );
    const input = component.find('.comment-input');
    input.simulate('keydown', {
      keyCode: 19,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    });
    input.simulate('keydown', {
      keyCode: 13,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    });
    expect(onSubmit.mock.calls.length).toEqual(1);
  });

  it('should recognize enter key press when is reply', () => {
    const component = shallow(<NewComment onSubmit={onSubmit} isReply />);
    const input = component.find('.comment-input');
    input.simulate('keydown', {
      keyCode: 19,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    });
    input.simulate('keydown', {
      keyCode: 13,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    });
    expect(onSubmit.mock.calls.length).toEqual(1);
  });

  it('should toggle private', () => {
    const component = shallow(<NewComment onSubmit={onSubmit} isReply />);
    const checkPrivate = component.find('#check-private');
    checkPrivate.simulate('click');
    const event = {
      preventDefault() {},
      target: { checked: true }
    };
    checkPrivate.simulate('change', event);
  });
});
