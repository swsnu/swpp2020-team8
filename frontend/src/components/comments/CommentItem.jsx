import React from 'react';
import styled from 'styled-components';
import LockIcon from '@material-ui/icons/Lock';
import ChatIcon from '@material-ui/icons/Chat';
import AuthorProfile from '../posts/AuthorProfile';

const CommentItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;
CommentItemWrapper.displayName = 'CommentItem';

const CommentContent = styled.div`
  margin: 0 12px;
`;

const ReplyWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #999;
  margin-right: 12px;
`;

export default function CommentItem({ commentObj }) {
  // const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  return (
    <CommentItemWrapper>
      <AuthorProfile author={commentObj.author_detail} isComment />
      <CommentContent id="comment-content">{commentObj.content}</CommentContent>
      <ReplyWrapper>
        <ChatIcon
          style={{ fontSize: '15px', color: '#999', marginRight: '3px' }}
        />
        답글
      </ReplyWrapper>
      {commentObj.is_private && (
        <LockIcon style={{ fontSize: '15px', color: '#999' }} />
      )}
    </CommentItemWrapper>
  );
}
