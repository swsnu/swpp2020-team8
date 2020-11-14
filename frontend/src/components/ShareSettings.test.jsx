import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import history from '../history';
import rootReducer from '../modules';
import ShareSettings from './ShareSettings';

describe('<ShareSettings />', () => {
  const mockStore = {
    friendReducer: {},
    notiReducer: {},
    postReducer: {},
    questionReducer: {},
    userReducer: {},
    loadingReducer: {}
  };

  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings newPost={{ content: '', type: 'Article' }} />
        </Router>
      </Provider>
    );

  jest.mock('react-redux', () => ({
    useDisPatch: () => jest.fn()
  }));

  it('should render without errors', async () => {
    const wrapper = getWrapper();
    expect(wrapper.find('ShareSettings').length).toBe(1);
  });

  it('should handles with toggles', async () => {
    const wrapper = getWrapper();
    const shareWithFriendsToggle = wrapper.find('.share-with-friends').at(0);
    expect(shareWithFriendsToggle.length).toBe(1);
    await act(async () => {
      shallow(shareWithFriendsToggle.prop('control')).simulate('change', {
        target: { checked: true }
      });
    });
  });

  it('should handles with submit button', async () => {
    const wrapper = getWrapper();
    const submitButton = wrapper.find('button');
    expect(submitButton.length).toBe(1);
    await act(async () => {
      submitButton.simulate('click');
    });
  });
});
