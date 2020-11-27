import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import PostItem from './PostItem';
import QuestionItem from './QuestionItem';
import NewPost from './NewPost';
import { PostItemWrapper } from '../../styles';

export default function PostList({ posts, isAppending, isLoading }) {
  const postList = posts.map((post) => {
    const postKey = `${post.type}-${post.id}`;
    if (post['content-type'] === 'Question' || post.type === 'Question')
      return (
        <QuestionItem key={postKey} postKey={postKey} questionObj={post} />
      );
    return <PostItem key={postKey} postKey={postKey} postObj={post} />;
  });

  const loadingList = [...Array(5)].map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <PostItemWrapper key={`loading-${index}`} className="skeleton-list">
      <Skeleton
        variant="circle"
        width={40}
        height={40}
        style={{ opacity: '0.8', margin: '4px 0' }}
      />
      <Skeleton
        animation="wave"
        variant="rect"
        height={88}
        style={{ opacity: '0.8', margin: '8px 0' }}
      />
    </PostItemWrapper>
  ));

  return (
    <div id="post-list">
      <NewPost />
      {isLoading ? loadingList : postList}
      <div style={{ margin: '8px', textAlign: 'center' }}>
        {isAppending && <CircularProgress id="spinner" color="primary" />}
      </div>
    </div>
  );
}
