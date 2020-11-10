import React from 'react';
import PostItem from './PostItem';
import QuestionItem from './QuestionItem';

export default function PostList({ posts }) {
  const postList = posts.map((post) => {
    if (post['content-type'] === 'Question')
      return <QuestionItem key={post.id} questionObj={post} />;
    return <PostItem key={post.id} postObj={post} />;
  });
  return <div id="post-list">{postList}</div>;
}
