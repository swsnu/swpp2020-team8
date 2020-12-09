import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import LockIcon from '@material-ui/icons/Lock';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useParams } from 'react-router';
import AuthorProfile from '../posts/AuthorProfile';
import NewComment from './NewComment';
import { createReply, deleteComment } from '../../modules/post';
import AlertDialog from '../common/AlertDialog';

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
  min-width: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #999;
  @media (max-width: 650px) {
    margin: 0;
  }
  margin-right: 12px;
`;

ReplyWrapper.displayName = 'ReplyWrapper';

const ReplyIcon = styled(SubdirectoryArrowRightIcon)`
  @media (max-width: 650px) {
    margin: 0;
  }
  margin-right: 3px;
  color: #777;
`;

export default function CommentItem({
  postKey,
  commentObj,
  isReply = false,
  isAuthor = false
}) {
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const isCommentAuthor = currentUser?.id === commentObj?.author_detail?.id;
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { id: targetId } = useParams();

  const replyItems = commentObj?.replies?.map((reply) => {
    const isReplyAuthor = currentUser?.id === reply.author_detail?.id;
    if (reply.is_private && !isAuthor && !isReplyAuthor && !isCommentAuthor) {
      return null;
    }
    return (
      <CommentItem
        postKey={postKey}
        className="reply-item"
        key={reply.id}
        isReply
        commentObj={reply}
      />
    );
  });

  const handleReplySubmit = (content, isPrivate) => {
    const newReplyObj = {
      target_type: 'Comment',
      target_id: commentObj.id,
      is_private: isPrivate,
      is_anonymous: commentObj?.is_anonymous,
      content
    };
    dispatch(createReply(newReplyObj, postKey, targetId));
  };

  const handleDeleteComment = () => {
    dispatch(deleteComment(commentObj.id, postKey, isReply, targetId));
    setIsDeleteDialogOpen(false);
  };
  const toggleReplyInputOpen = () => setIsReplyInputOpen((prev) => !prev);

  const onCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <CommentItemWrapper id={commentObj.id}>
        {isReply && <ReplyIcon />}
        <AuthorProfile author={commentObj.author_detail} isComment />
        <CommentContent id="comment-content">
          {commentObj.content}
        </CommentContent>
        {!isReply && (
          <ReplyWrapper onClick={toggleReplyInputOpen}>답글</ReplyWrapper>
        )}
        {commentObj.is_private && (
          <LockIcon style={{ fontSize: '14px', color: '#bbb' }} />
        )}

        {isCommentAuthor && (
          <DeleteForeverIcon
            onClick={() => setIsDeleteDialogOpen(true)}
            id="delete-comment-icon"
            style={{ margin: '3px', fontSize: '17px', color: '#999' }}
          />
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
        <AlertDialog
          message="정말 삭제하시겠습니까?"
          onConfirm={handleDeleteComment}
          onClose={onCancelDelete}
          isOpen={isDeleteDialogOpen}
        />
      </div>
    </>
  );
}
