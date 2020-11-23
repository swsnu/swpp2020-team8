import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import LockIcon from '@material-ui/icons/Lock';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import AuthorProfile from '../posts/AuthorProfile';
import NewComment from './NewComment';
import { createReply } from '../../modules/post';

const CommentItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 12px;
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

export default function CommentItem({ postKey, commentObj, isReply = false }) {
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const dispatch = useDispatch();
  const replyItems = commentObj?.replies?.map((reply) => (
    <CommentItem
      postKey={postKey}
      className="reply-item"
      key={reply.id}
      isReply
      commentObj={reply}
    />
  ));

  const handleReplySubmit = (content, isPrivate) => {
    const newReplyObj = {
      target_type: 'Comment',
      target_id: commentObj.id,
      is_private: isPrivate,
      content
    };
    dispatch(createReply(newReplyObj, postKey));
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
        {commentObj.is_private && (
          <LockIcon style={{ fontSize: '15px', color: '#999' }} />
        )}
        {!isReply && (
          <ReplyWrapper onClick={toggleReplyInputOpen}>답글</ReplyWrapper>
        )}
      </CommentItemWrapper>
      <div>{replyItems}</div>
      <div>
        {isReplyInputOpen && (
          <NewComment
            isReply
            onSubmit={handleReplySubmit}
            forcePrivate={commentObj.is_private}
          />
        )}
      </div>
    </>
  );
}
