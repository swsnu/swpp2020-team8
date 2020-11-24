import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getSelectedPost } from '../modules/post';
import PostItem from '../components/posts/PostItem';
import QuestionItem from '../components/posts/QuestionItem';

export default function PostDetail() {
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  const { postType, id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSelectedPost(postType, id));
  }, [postType, id, dispatch]);

  if (
    selectedPost?.type === 'Question' ||
    selectedPost?.['content-type'] === 'Question'
  )
    return (
      <div id="post-detail-question">
        {selectedPost && <QuestionItem questionObj={selectedPost} />}
      </div>
    );
  return (
    <div id="post-detail-not-question">
      {selectedPost && <PostItem postObj={selectedPost} />}
    </div>
  );
}
