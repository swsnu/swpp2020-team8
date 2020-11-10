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

describe('<QuestionItem/>', () => {
  it('should render without errors', () => {
    const component = shallow(<QuestionItem questionObj={sampleQuestionObj} />);
    const questionItem = component.find('QuestionItemWrapper');
    expect(questionItem.length).toBe(1);
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
});
