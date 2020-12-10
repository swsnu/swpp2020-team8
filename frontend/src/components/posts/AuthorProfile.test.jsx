import React from 'react';
import { shallow } from 'enzyme';
import AuthorProfile from './AuthorProfile';
import 'jest-styled-components';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const mockAuthor = {
  id: 123,
  username: 'curious',
  profile_pic:
    'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
};

const mockAnon = {
  color_hex: '#000'
};

describe('<AuthorProfile />', () => {
  it('image should render without errors', () => {
    const component = shallow(
      <AuthorProfile author={mockAuthor} isComment={false} />
    );
    const img = component.find('FaceIcon');
    expect(img.length).toBe(1);
  });

  it('image width should be changed when comment', () => {
    const component = shallow(<AuthorProfile author={mockAuthor} isComment />);
    const img = component.find('FaceIcon');
    expect(img.length).toBe(1);
    expect(img.props().style.width).toEqual('20px');
  });

  it('should display color circle when anon user', () => {
    const component = shallow(<AuthorProfile author={mockAnon} />);
    const img = component.find('AnonIcon');
    expect(img).toBeTruthy();
    expect(img).toHaveStyleRule('background', '#000');
  });

  it('should have correct author name', () => {
    const component = shallow(
      <AuthorProfile author={mockAuthor} isComment={false} />
    );
    const authorname = component.find('div');
    expect(authorname.text()).toBe('curious');
  });
});
