import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getSelectedPost } from '../modules/post';
import PostItem from '../components/posts/PostItem';
import QuestionItem from '../components/posts/QuestionItem';
import Message from '../components/Message';

export default function PostDetail() {
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  const selectedPostFailure = useSelector(
    (state) => state.postReducer.selectedPostFailure
  );
  const { postType, id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSelectedPost(postType, id));
  }, [postType, id, dispatch]);

  if (selectedPostFailure) {
    return (
      <Message
        message="permission"
        messageDetail="접근할 수 없는 게시물입니다"
      />
    );
  }
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
      {selectedPost && (
        <PostItem
          postObj={selectedPost}
          postKey={`${selectedPost.type}-${selectedPost.id}`}
          isDetailPage
        />
      )}
    </div>
  );
}
