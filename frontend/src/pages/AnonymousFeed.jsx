import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/posts/PostList';
import { getPostsByType } from '../modules/post';

const AnonymousFeed = () => {
  const dispatch = useDispatch();
  const anonymousPosts = useSelector(
    (state) => state.postReducer.anonymousPosts
  );

  useEffect(() => {
    dispatch(getPostsByType('anon'));
  }, [dispatch]);

  return (
    <>
      <PostList posts={anonymousPosts} />
    </>
  );
};

export default AnonymousFeed;
