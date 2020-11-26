import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/posts/PostList';
import { appendPosts, getPostsByType } from '../modules/post';
// import Article from './temp/Article';

const FriendFeed = () => {
  const [target, setTarget] = useState(false);
  const dispatch = useDispatch();
  const friendPosts = useSelector((state) => state.postReducer.friendPosts);

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, { threshold: 1 });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      dispatch(appendPosts('friend'));
    }
  };

  useEffect(() => {
    dispatch(getPostsByType('friend'));
  }, [dispatch]);

  return (
    <>
      <PostList posts={friendPosts} />
      <div ref={setTarget} />
    </>
  );
};

export default FriendFeed;
