import { shallow } from 'enzyme/build';
import React from 'react';
import PostAuthorButtons from './PostAuthorButtons';

const onClickDelete = jest.fn();
const onClickEdit = jest.fn();

describe('<PostAuthorButtons />', () => {
  it('should render without errors', () => {
    const component = shallow(
      <PostAuthorButtons
        onClickDelete={onClickDelete}
        onClickEdit={onClickEdit}
      />
    );
    const wrapper = component.find('PostAuthorWrapper');
    expect(wrapper.length).toBe(1);
    const button = component.find('#more-button');
    button.simulate('click');
  });
});
