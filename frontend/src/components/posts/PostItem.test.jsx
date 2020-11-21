import { shallow } from 'enzyme/build';
import React from 'react';
import PostItem from './PostItem';

const samplepostObj = {
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
  question: {
    id: 1244,
    question: '어디서 마시는 커피를 가장 좋아하는가?'
  },
  content:
    '스타벅스에서 먹는 바닐라크림콜드브루! 시럽은 1번만 넣고 에스프레소휩을 올리면 행복~',
  created_at: '2020-11-05T14:16:13.801119+08:00',
  comments: [
    {
      id: 1272,
      post_id: 383,
      content: 'fun',
      author: 1,
      author_detail: {
        id: 123,
        username: 'curious',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      }
    }
  ]
};

const mockArticle = {
  id: 4756,
  'content-type': 'Article', // or const int e.g. (1: Article, 2: Response...)
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  }, // blank or null if anonymous
  created_at: '2020-09-23T10:38:47.975019+08:00',
  content:
    '안녕하세요 반가워요 잘있어요 다시만나요 이거는 질문없이 쓰는 그냥 뻘글이에요 이쁘죠?????',
  comments: [
    {
      id: 1272,
      post_id: 383,
      content: '재밌네요',
      author: 1,
      author_detail: {
        id: 123,
        username: 'curious',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      },
      referenced_comments: 1272,
      is_reply: false,
      replies: [
        {
          id: 1273,
          post_id: 383,
          content: '같이하고싶어요',
          author: 2,
          author_detail: {
            id: 2,
            profile_pic:
              'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
            username: '아이폰'
          },
          is_poster_owner: false,
          referenced_comments: 1272,
          is_reply: true,
          is_private: false,
          create_dt: '2020-09-23T10:40:24.421000+08:00',
          update_dt: '2020-09-23T10:40:24.428734+08:00'
        }
      ],
      is_private: false,
      create_dt: '2020-09-23T10:38:47.975019+08:00',
      update_dt: '2020-09-23T10:39:35.849029+08:00'
    },

    {
      id: 1274,
      post_id: 383,
      content: '퍼가요!!!!',
      author: 3,
      author_detail: {
        id: 2,
        profile_pic:
          'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png',
        username: '아이폰'
      },
      referenced_comments: 1274,
      is_reply: false,
      is_private: true,
      create_dt: '2020-09-23T10:40:42.268355+08:00',
      update_dt: '2020-09-23T10:40:42.268384+08:00'
    }
  ]
};

describe('<PostItem />', () => {
  it('should render article without errors', () => {
    const component = shallow(<PostItem postObj={samplepostObj} />);
    const wrapper = component.find('PostItemWrapper');
    expect(wrapper.length).toBe(1);
    const question = component.find('QuestionBox');
    expect(question.length).toBe(0);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(1);
  });

  it('should render response and question without errors', () => {
    const component = shallow(<PostItem postObj={sampleResponseObj} />);
    const wrapper = component.find('PostItemWrapper');
    expect(wrapper.length).toBe(1);
    const question = component.find('QuestionBox');
    expect(question.length).toBe(1);
  });

  it('should toggle like', async () => {
    const component = shallow(<PostItem postObj={sampleResponseObj} />);
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

  it('should toggle like', async () => {
    const component = shallow(<PostItem postObj={mockArticle} />);
    expect(component.find('CommentItem').length).toEqual(
      mockArticle.comments.length
    );
  });
});
