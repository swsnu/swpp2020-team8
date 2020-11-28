import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/posts/PostList';
import { getPostsByType } from '../modules/post';
import NoContentInfo from '../components/NoContentInfo';

const FriendFeed = () => {
  const dispatch = useDispatch();
  const friendPosts = useSelector((state) => state.postReducer.friendPosts);

  useEffect(() => {
    dispatch(getPostsByType('friend'));
  }, [dispatch]);

  return (
    <>
      {friendPosts?.length === 0 ? (
        <NoContentInfo message="친구를 맺어보세요!" />
      ) : (
        <PostList posts={friendPosts} />
      )}
    </>
  );
};

export default FriendFeed;
