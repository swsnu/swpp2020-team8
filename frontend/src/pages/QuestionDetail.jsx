import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getSelectedPost } from '../modules/post';
import QuestionItem from '../components/posts/QuestionItem';

export default function ResponseDetail() {
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSelectedPost('question', id));
  }, [id, dispatch]);

  return (
    <div id="response-detail">
      {selectedPost && <QuestionItem questionObj={selectedPost} />}
    </div>
  );
}
