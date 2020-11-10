import { shallow } from 'enzyme/build';
import React from 'react';
import PostItem from './PostItem';

const sampleArticleObj = {
  id: 4756,
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: `ㅋㅋ은 대한민국의 인터넷 신조어로, 한글의 자음 중 하나인 'ㅋ'를 이용해 웃음소리를 표현한 것이다. ㅋㅋ는 의성어인 '큭큭', '킥킥', '캭캭' 등을 초성체로 줄여 쓴 것으로 해석하는 것이 일반적이며, ㅋ자의 빈도와 상황에 따라 여러 가지 의미와 느낌을 줄 수 있다. `,
  created_at: '2020-11-05T14:16:13.801119+08:00'
};

const sampleResponseObj = {
  id: 4757,
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  question_detail: {
    id: 1244,
    question: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  content:
    '스타벅스에서 먹는 바닐라크림콜드브루! 시럽은 1번만 넣고 에스프레소휩을 올리면 행복~',
  created_at: '2020-11-05T14:16:13.801119+08:00'
};

describe('<PostItem />', () => {
  it('should render article without errors', () => {
    const component = shallow(<PostItem articleObj={sampleArticleObj} />);
    const wrapper = component.find('PostItemWrapper');
    expect(wrapper.length).toBe(1);
    const question = component.find('QuestionBox');
    expect(question.length).toBe(0);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(1);
  });

  it('should render response and question without errors', () => {
    const component = shallow(<PostItem articleObj={sampleResponseObj} />);
    const wrapper = component.find('PostItemWrapper');
    expect(wrapper.length).toBe(1);
    const question = component.find('QuestionBox');
    expect(question.length).toBe(1);
  });

  it('should toggle like', async () => {
    const component = shallow(<PostItem articleObj={sampleResponseObj} />);
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
});
