/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

jest.mock('react-redux', () => ({
  // useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn()
}));

describe('<PrivateRoute />', () => {
  it('should render component if user has been signed in', () => {
    const component = () => <div id="test-component">component</div>;
    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={['/friends']}>
        <PrivateRoute signedIn={true} component={component} />
      </MemoryRouter>
    );
    expect(enzymeWrapper.exists('#test-component')).toBe(true);
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
