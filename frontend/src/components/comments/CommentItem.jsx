import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import LockIcon from '@material-ui/icons/Lock';
import ChatIcon from '@material-ui/icons/Chat';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import AuthorProfile from '../posts/AuthorProfile';
import NewComment from './NewComment';
import { createReply } from '../../modules/post';

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

ReplyWrapper.displayName = 'ReplyWrapper';

const ReplyIcon = styled(SubdirectoryArrowRightIcon)`
  margin-right: 3px;
  color: #777;
`;

export default function CommentItem({ commentObj, isReply = false }) {
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const dispatch = useDispatch();
  const replyItems = commentObj?.replies?.map((reply) => (
    <CommentItem
      className="reply-item"
      key={reply.id}
      isReply
      commentObj={reply}
    />
  ));

  const handleReplySubmit = (content) => {
    const newReplyObj = {
      target_type: 'Comment',
      target_id: commentObj.id,
      content
    };
    dispatch(createReply(newReplyObj));
  };

  const toggleReplyInputOpen = () => setIsReplyInputOpen((prev) => !prev);
  return (
    <>
      <CommentItemWrapper>
        {isReply && <ReplyIcon />}
        <AuthorProfile author={commentObj.author_detail} isComment />
        <CommentContent id="comment-content">
          {commentObj.content}
        </CommentContent>
        {!isReply && (
          <ReplyWrapper onClick={toggleReplyInputOpen}>
            <ChatIcon
              style={{ fontSize: '15px', color: '#999', marginRight: '3px' }}
            />
            답글
          </ReplyWrapper>
        )}
        {commentObj.is_private && (
          <LockIcon style={{ fontSize: '15px', color: '#999' }} />
        )}
      </CommentItemWrapper>
      <div>{replyItems}</div>
      <div>
        {isReplyInputOpen && (
          <NewComment isReply onSubmit={handleReplySubmit} />
        )}
      </div>
    </>
  );
}
