import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import AuthorProfile from './AuthorProfile';
import { mockStore } from '../../mockStore';
import rootReducer from '../../modules';
import history from '../../history';
import 'jest-styled-components';

const mockAuthor = {
  id: 123,
  username: 'curious',
  profile_pic:
    'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
};

describe('<ArticlePreview />', () => {
  it('image should render without errors', () => {
    const component = shallow(
      <AuthorProfile author={mockAuthor} isComment={false} />
    );
    const img = component.find('#profile-image');
    expect(img.length).toBe(1);
    expect(img).toHaveStyleRule('width', '30px');
  });

  it('image width should be changed when comment', () => {
    const component = shallow(<AuthorProfile author={mockAuthor} isComment />);
    const img = component.find('#profile-image');
    expect(img.length).toBe(1);
    expect(img).toHaveStyleRule('width', '20px');
  });

  it('image width should be 30px w/default param props', () => {
    const component = shallow(<AuthorProfile author={mockAuthor} />);
    const img = component.find('#profile-image');
    expect(img.length).toBe(1);
    expect(img).toHaveStyleRule('width', '30px');
  });

  it('should have correct author name', () => {
    const component = shallow(
      <AuthorProfile author={mockAuthor} isComment={false} />
    );
    const authorname = component.find('div');
    expect(authorname.text()).toBe('curious');
  });
});

describe('<AuthorProfile /> unit mount test', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <AuthorProfile author={mockAuthor} isComment={false} />
        </Router>
      </Provider>
    );

  it('SignUp Page should mount', async () => {
    const wrapper = getWrapper();
    const img = wrapper.find('img');
    expect(img).toHaveStyleRule('width', '30px');

    // console.log(img.prop('style'));
    // console.log(getComputedStyle(img.getDOMNode()));
    // expect(
    //   getComputedStyle(img.get(0).getDOMNode()).getPropertyValue('width')
    // ).toBe('30px');
  });
});
