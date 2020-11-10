import React from 'react';
import ArticleItem from '../../components/posts/PostItem';
import QuestionItem from '../../components/posts/QuestionItem';
import NewPost from '../../components/NewPost';

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

const sampleQuestionObj = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'false',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

const sampleCustomQuestionObj = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'false',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export default function Article() {
  return (
    <div style={{ width: '650px' }}>
      <NewPost />
      <ArticleItem articleObj={sampleArticleObj} />
      <ArticleItem articleObj={sampleResponseObj} />
      <QuestionItem questionObj={sampleQuestionObj} />
      <QuestionItem questionObj={sampleCustomQuestionObj} />
    </div>
  );
}
