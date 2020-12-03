import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message';

describe('<Message/>', () => {
  it('should render without errors', () => {
    const component = shallow(
      <Message message="message" messageDetail="messageDetail" />
    );
    expect(component.length).toBe(1);
    const title = component.find('h2');
    expect(title.length).toBe(1);
  });
});
