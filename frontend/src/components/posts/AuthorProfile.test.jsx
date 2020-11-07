import React from 'react';
import { shallow } from 'enzyme';
import AuthorProfile from './AuthorProfile';

const mockAuthor = {
  id: 123,
  username: 'curious',
  profile_pic:
    'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
};

describe('<ArticlePreview />', () => {
  it('should render without errors', () => {
    const component = shallow(
      <AuthorProfile author={mockAuthor} isComment={false} />
    );
    console.log(component.debug());
    const img = component.find('img');
    expect(img.length).toBe(1);
  });
});
