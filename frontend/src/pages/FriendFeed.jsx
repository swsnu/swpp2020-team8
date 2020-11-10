import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/posts/PostList';
import { getPostsByType } from '../modules/post';
// import Article from './temp/Article';

const FriendFeed = () => {
  const dispatch = useDispatch();
  const friendPosts = useSelector((state) => state.postReducer.friendPosts);

  useEffect(() => {
    dispatch(getPostsByType('friend'));
  }, [dispatch]);

  return (
    <>
      <PostList posts={friendPosts} />
    </>
  );
};

export default FriendFeed;
