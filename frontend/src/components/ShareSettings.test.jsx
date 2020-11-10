import { mount } from 'enzyme';
import React from 'react';
import { Router } from 'react-router-dom';
import history from '../history';
import ShareSettings from './ShareSettings';

describe('<NewPost />', () => {
  const getWrapper = () =>
    mount(
      <Router history={history}>
        <ShareSettings />
      </Router>
    );

  it('should render without errors', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('ShareSettings').length).toBe(1);
  });

  it('should handles with toggles', () => {
    const wrapper = shallow(<ShareSettings />);
    const shareWithFriendsToggle = wrapper.find('.share-with-friends');
    expect(shareWithFriendsToggle.length).toBe(1);
    shallow(shareWithFriendsToggle.prop('control')).simulate('change', {
      target: { checked: true }
    });
  });

  it('should handles with submit button', () => {
    const wrapper = shallow(<ShareSettings />);
    const submitButton = wrapper.find('#submit-button');
    expect(submitButton.length).toBe(1);
    submitButton.simulate('click');
  });
});
