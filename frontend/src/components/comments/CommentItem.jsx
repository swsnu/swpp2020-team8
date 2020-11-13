import React from 'react';
import styled from 'styled-components';
import AuthorProfile from '../posts/AuthorProfile';

const CommentItemWrapper = styled.div`
  display: flex;
  padding: 8px 0;
`;

const CommentContent = styled.div`
  margin-left: 12px;
`;
export default function CommentItem({ commentObj }) {
  return (
    <CommentItemWrapper isReply={commentObj.is_reply}>
      <AuthorProfile author={commentObj.author_detail} isComment />
      <CommentContent>{commentObj.content}</CommentContent>
    </CommentItemWrapper>
  );
}
