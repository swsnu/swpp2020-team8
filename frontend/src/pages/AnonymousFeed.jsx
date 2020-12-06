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
  const isAppending =
    useSelector((state) => state.loadingReducer['post/APPEND_POSTS']) ===
    'REQUEST';
  const isLoading =
    useSelector((state) => state.loadingReducer['post/GET_ANON_POSTS']) ===
    'REQUEST';

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
      <PostList
        posts={anonymousPosts}
        isAppending={isAppending}
        isLoading={isLoading}
      />
      <div ref={setTarget} />
    </>
  );
};

export default AnonymousFeed;
