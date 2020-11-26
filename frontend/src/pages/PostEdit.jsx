import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getSelectedPost } from '../modules/post';
import PostEditItem from '../components/posts/PostEditItem';

const PostEdit = () => {
  const { postType, id } = useParams();
  const dispatch = useDispatch();

  const selectedPost = useSelector((state) => state.postReducer.selectedPost);

  useEffect(() => {
    dispatch(getSelectedPost(postType, id));
  }, [postType, id, dispatch]);

  return selectedPost && <PostEditItem postObj={selectedPost} />;
};

export default PostEdit;
