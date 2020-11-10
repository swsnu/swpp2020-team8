/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import FriendFeed from '../pages/FriendFeed';

describe('<PrivateRoute />', () => {
  it('should render component if user has been signed in', () => {
    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={['/friends']}>
        <PrivateRoute signedIn={true} component={FriendFeed} />
      </MemoryRouter>
    );
    expect(enzymeWrapper.exists(FriendFeed)).toBe(true);
  });

  it('should redirect /login if user is not signed in', () => {
    const component = () => <div>component</div>;
    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={['/friends']}>
        <PrivateRoute signedIn={false} component={component} />
      </MemoryRouter>
    );
    const history = enzymeWrapper.find('Router').prop('history');
    expect(history.location.pathname).toBe('/login');
  });
});
