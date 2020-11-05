import React from 'react';
import ArticleItem from '../../components/posts/ArticleItem';

const sampleArticleObj = {
  id: 4756,
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png'
  },
  content: `ㅋㅋ은 대한민국의 인터넷 신조어로, 한글의 자음 중 하나인 'ㅋ'를 이용해 웃음소리를 표현한 것이다. ㅋㅋ는 의성어인 '큭큭', '킥킥', '캭캭' 등을 초성체로 줄여 쓴 것으로 해석하는 것이 일반적이며, ㅋ자의 빈도와 상황에 따라 여러 가지 의미와 느낌을 줄 수 있다. `,
  created_at: '2020-11-05T14:16:13.801119+08:00'
};

export default function Article() {
  return (
    <div style={{ width: '650px' }}>
      <ArticleItem articleObj={sampleArticleObj} />
    </div>
  );
}
