import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getSelectedPost } from '../modules/post';
// import QuestionItem from '../components/posts/QuestionItem';
import PostItem from '../components/posts/PostItem';

export default function ArticleDetail() {
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSelectedPost('article', id));
  }, [id, dispatch]);

  return (
    <div id="article-detail">
      {selectedPost && <PostItem postObj={selectedPost} />}
    </div>
  );
}
