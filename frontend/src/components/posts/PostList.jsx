import React from 'react';
import PostItem from './PostItem';
import QuestionItem from './QuestionItem';
import NewPost from './NewPost';

export default function PostList({ posts }) {
  const postList = posts.map((post) => {
    const postKey = `${post.type}-${post.id}`;
    if (post['content-type'] === 'Question' || post.type === 'Question')
      return (
        <QuestionItem key={postKey} postKey={postKey} questionObj={post} />
      );
    return <PostItem key={postKey} postKey={postKey} postObj={post} />;
  });
  return (
    <div id="post-list">
      <NewPost />
      {postList}
    </div>
  );
}
