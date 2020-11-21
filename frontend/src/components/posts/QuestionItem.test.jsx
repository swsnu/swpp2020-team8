import { shallow } from 'enzyme/build';
import React from 'react';
import QuestionItem from './QuestionItem';

const sampleQuestionObj = {
  id: 4758,
  author_detail: {
    id: 1,
    username: 'admin',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  question_detail: {
    id: 1244,
    question: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  created_at: '2020-11-05T14:16:13.801119+08:00'
};

const sampleCustomQuestionObj = {
  id: 4758,
  author_detail: {
    id: 1,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  question_detail: {
    id: 1244,
    question: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  created_at: '2020-11-05T14:16:13.801119+08:00'
};

describe('<QuestionItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const questionItem = component.find('QuestionItemWrapper');
    expect(questionItem.length).toBe(1);
  });

  it('should not render <AuthorProfile/>, <PostAuthorButtons/> for admin questions', () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const authorProfile = component.find('AuthorProfile');
    expect(authorProfile.length).toBe(0);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(0);
  });

  it('should render <AuthorProfile/>, <PostAuthorButtons/> for author questions', () => {
    const component = shallow(
      <QuestionItem questionObj={sampleCustomQuestionObj} />
    );
    const authorProfile = component.find('AuthorProfile');
    expect(authorProfile.length).toBe(1);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(1);
  });

  it('should toggle like', async () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const likeButton = component.find('FavoriteBorderIcon').parent();
    let unlikeButton = component.find('FavoriteIcon').parent();
    const likeCount = component.find('#like-count').at(0).text();
    expect(+likeCount).toEqual(0);
    expect(likeButton.length).toBe(1);
    expect(unlikeButton.length).toBe(0);
    likeButton.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 500));
    unlikeButton = component.find('FavoriteIcon').parent();
    expect(unlikeButton.length).toBe(1);
    unlikeButton.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(+likeCount).toEqual(0);
  });

  it('should toggle write', async () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const writeButton = component.find('CreateIcon').parent();
    writeButton.simulate('click');
    const textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(1);
  });

  it('should change input content', async () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const writeButton = component.find('CreateIcon').parent();
    writeButton.simulate('click');
    await new Promise((resolve) => setTimeout(resolve, 200));
    const contentEvent = {
      preventDefault() {},
      target: { name: 'username', value: 'hello' }
    };
    const contentInput = component.find('#content-input');
    contentInput.simulate('change', contentEvent);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const textArea = component.find('TextareaAutosize');
    // expect(textArea.pro).toBe(1);
    expect(textArea.prop('value')).toEqual('hello');
  });

  it('should pass reset function', () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const writeButton = component.find('CreateIcon').parent();
    writeButton.simulate('click');
    expect(typeof component.find('ShareSettings').props().resetContent).toBe(
      'function'
    );
  });
});
