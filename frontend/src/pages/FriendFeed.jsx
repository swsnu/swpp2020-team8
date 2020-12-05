import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/posts/PostList';
import { appendPosts, getPostsByType } from '../modules/post';
import Message from '../components/Message';
import NewPost from '../components/posts/NewPost';

const FriendFeed = () => {
  const [target, setTarget] = useState(false);
  const dispatch = useDispatch();
  const friendPosts = useSelector((state) => state.postReducer.friendPosts);
  const isAppending = useSelector(
    (state) => state.loadingReducer['post/APPEND_POSTS']
  );
  const isLoading = useSelector(
    (state) => state.loadingReducer['post/GET_FRIEND_POSTS']
  );

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
      {friendPosts?.length === 0 && !isLoading ? (
        <>
          <NewPost />
          <Message
            margin="16px 0"
            message="표시할 게시물이 없습니다 :("
            messageDetail="다른 사용자들과 친구를 맺어보세요!"
          />
        </>
      ) : (
        <PostList
          posts={friendPosts}
          isAppending={isAppending}
          isLoading={isLoading}
        />
      )}
      <div ref={setTarget} />
    </>
  );
};

export default FriendFeed;
