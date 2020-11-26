import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/posts/PostList';
import { getPostsByType, appendPosts } from '../modules/post';

const AnonymousFeed = () => {
  const [target, setTarget] = useState(null);
  const dispatch = useDispatch();
  const anonymousPosts = useSelector(
    (state) => state.postReducer.anonymousPosts
  );

  useEffect(() => {
    dispatch(getPostsByType('anon'));
  }, [dispatch]);

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
      dispatch(appendPosts('anonymous'));
    }
  };

  return (
    <>
      <PostList posts={anonymousPosts} />
      <div ref={setTarget} />
    </>
  );
};

export default AnonymousFeed;
