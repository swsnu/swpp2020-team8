import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PostItem from './PostItem';
import QuestionItem from './QuestionItem';
import NewPost from './NewPost';
import LoadingList from './LoadingList';

export default function PostList({ posts, isAppending, isLoading }) {
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
      {isLoading ? <LoadingList /> : postList}
      <div style={{ margin: '8px', textAlign: 'center' }}>
        {isAppending && <CircularProgress id="spinner" color="primary" />}
      </div>
    </div>
  );
}
