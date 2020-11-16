import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router';
import { getSelectedPost } from '../modules/post';
import QuestionItem from '../components/posts/QuestionItem';
import PostItem from '../components/posts/PostItem';

export default function PostDetail() {
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  //   const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getSelectedPost({ id }));
    dispatch(getSelectedPost());
  }, [dispatch]);
  // [id, dispatch]

  return (
    <div id="post-detail">
      {selectedPost && selectedPost['content-type'] === 'Question'
        ? selectedPost && <QuestionItem questionObj={selectedPost} />
        : selectedPost && <PostItem postObj={selectedPost} />}
    </div>
  );
}
