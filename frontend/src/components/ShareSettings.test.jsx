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

  const resetContent = jest.fn();
  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings
            newPost={{ content: 'test', type: 'Article' }}
            resetContent={resetContent}
          />
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

  it('should handle with toggles', async () => {
    const wrapper = getWrapper();
    const shareWithFriendsToggle = wrapper.find('.share-with-friends').at(0);
    expect(shareWithFriendsToggle.length).toBe(1);
    await act(async () => {
      shallow(shareWithFriendsToggle.prop('control')).simulate('change', {
        target: { checked: true }
      });
    });
  });

  it('should handle with location pathname /friends', async () => {
    history.push('/friends');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings
            newPost={{ content: 'test', type: 'Article' }}
            resetContent={resetContent}
          />
        </Router>
      </Provider>
    );
    const shareWithFriendsToggle = wrapper.find('#share-with-friends').at(0);
    expect(shareWithFriendsToggle.props().checked).toBeTruthy();
    const shareAnon = wrapper.find('#share-anonymously').at(0);
    expect(shareAnon.props().checked).toBeFalsy();
  });

  it('should handle with location pathname /anonymous', async () => {
    history.push('/anonymous');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings
            newPost={{ content: 'test', type: 'Article' }}
            resetContent={resetContent}
          />
        </Router>
      </Provider>
    );
    const shareWithFriendsToggle = wrapper.find('#share-with-friends').at(0);
    expect(shareWithFriendsToggle.props().checked).toBeFalsy();
    const shareAnon = wrapper.find('#share-anonymously').at(0);
    expect(shareAnon.props().checked).toBeTruthy();
  });

  it('should handle with submit button /friends', async () => {
    history.push('/friends');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings
            newPost={{ content: 'test', type: 'Article' }}
            resetContent={resetContent}
          />
        </Router>
      </Provider>
    );
    const submitButton = wrapper.find('button');
    expect(submitButton.length).toBe(1);
    await act(async () => {
      submitButton.simulate('click');
    });
    submitButton.simulate('click');

    const shareWithFriendsToggle = wrapper.find('#share-with-friends').at(0);
    expect(shareWithFriendsToggle.props().checked).toBeTruthy();
    const shareAnon = wrapper.find('#share-anonymously').at(0);
    expect(shareAnon.props().checked).toBeFalsy();
  });

  it('should handle with submit button /anonymous', async () => {
    history.push('/anonymous');
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings
            newPost={{ content: 'test', type: 'Article' }}
            resetContent={resetContent}
          />
        </Router>
      </Provider>
    );
    const submitButton = wrapper.find('button');
    expect(submitButton.length).toBe(1);
    await act(async () => {
      submitButton.simulate('click');
    });
    submitButton.simulate('click');

    const shareWithFriendsToggle = wrapper.find('#share-with-friends').at(0);
    expect(shareWithFriendsToggle.props().checked).toBeFalsy();
    const shareAnon = wrapper.find('#share-anonymously').at(0);
    expect(shareAnon.props().checked).toBeTruthy();
  });

  it('should not submitted when no content', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ShareSettings
            newPost={{ content: '', type: 'Article' }}
            resetContent={resetContent}
          />
        </Router>
      </Provider>
    );
    const submitButton = wrapper.find('button');
    expect(submitButton.length).toBe(1);
    submitButton.simulate('click');
    expect(jest.fn()).toHaveBeenCalledTimes(0);
  });
});
