/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../modules';
import PrivateRoute from './PrivateRoute';

describe('<PrivateRoute />', () => {
  it('should render component if user has been signed in', () => {
    const component = () => <div id="test-component">component</div>;
    const mockUserStore = {
      friendReducer: {},
      notiReducer: {},
      postReducer: {},
      questionReducer: {},
      userReducer: {
        currentUser: {
          id: 0
        }
      },
      loadingReducer: {}
    };

    const signedInStore = createStore(
      rootReducer,
      mockUserStore,
      composeWithDevTools(applyMiddleware(thunk))
    );

    const getWrapper = () =>
      mount(
        <MemoryRouter initialEntries={['/friends']}>
          <Provider store={signedInStore}>
            <PrivateRoute component={component} />
          </Provider>
        </MemoryRouter>
      );
    const enzymeWrapper = getWrapper();
    expect(enzymeWrapper.find('MemoryRouter').length).toEqual(1);
    expect(enzymeWrapper.find('PrivateRoute').length).toEqual(1);
    expect(enzymeWrapper.exists('#test-component')).toBe(true);
  });

  it('should redirect /login if user is not signed in', () => {
    const component = () => <div>component</div>;

    const notSignedInStore = createStore(
      rootReducer,
      {
        friendReducer: {},
        notiReducer: {},
        postReducer: {},
        questionReducer: {},
        userReducer: {
          currentUser: null
        },
        loadingReducer: {}
      },
      composeWithDevTools(applyMiddleware(thunk))
    );

    const getWrapper = () =>
      mount(
        <MemoryRouter initialEntries={['/friends']}>
          <Provider store={notSignedInStore}>
            <PrivateRoute component={component} />
          </Provider>
        </MemoryRouter>
      );

    const enzymeWrapper = getWrapper();
    const history = enzymeWrapper.find('Router').prop('history');
    expect(history.location.pathname).toBe('/login');
  });
});
