import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import LockIcon from '@material-ui/icons/Lock';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { useParams } from 'react-router';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AuthorProfile from '../posts/AuthorProfile';
import NewComment from './NewComment';
import { createReply, deleteComment } from '../../modules/post';
import AlertDialog from '../common/AlertDialog';
import { likePost, unlikePost } from '../../modules/like';
import CommentCreateTime from './CommentCreateTime';

const CommentItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 4px;
  font-size: 12px;
  justify-content: space-between;
`;
CommentItemWrapper.displayName = 'CommentItem';

const CommentContent = styled.div`
  margin: 0 12px 0 6px;
  margin: 0 12px;
  @media (max-width: 650px) {
    margin: 0 6px;
  }
`;

const IconButton = styled.div``;

const ReplyWrapper = styled.div`
  min-width: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  :hover: {
    color: #000;
  }
`;

const DeleteWrapper = styled.div`
  min-width: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
  margin-left: 4px;
  :hover: {
    color: #000;
  }
`;

ReplyWrapper.displayName = 'ReplyWrapper';
DeleteWrapper.displayName = 'DeleteWrapper';

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
  isAuthor = false,
  isAnon = false
}) {
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const isCommentAuthor = currentUser?.id === commentObj?.author_detail?.id;
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [liked, setLiked] = useState(commentObj.current_user_liked);
  const [likeCount, setLikeCount] = useState(commentObj.like_count || 0);
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
        isAnon={isAnon}
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

  const toggleLike = () => {
    const postInfo = {
      target_type: 'Comment',
      target_id: commentObj.id,
      is_anonymous: isAnon
    };
    if (liked) {
      setLikeCount((prev) => prev - 1);
      dispatch(unlikePost(postInfo));
    } else {
      setLikeCount((prev) => prev + 1);
      dispatch(likePost(postInfo));
    }
    setLiked((prev) => !prev);
  };

  return (
    <>
      <CommentItemWrapper id={commentObj.id}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {isReply && <ReplyIcon />}
            {commentObj.is_private && (
              <LockIcon
                style={{
                  fontSize: '16px',
                  color: 'rgb(187, 187, 187)',
                  margin: '6px 4px 0 0'
                }}
              />
            )}
            <AuthorProfile
              author={commentObj.author_detail}
              isComment
              isAuthor={isCommentAuthor}
            />
            <CommentContent id="comment-content" style={{ marginTop: '4px' }}>
              {commentObj.content}
            </CommentContent>
          </div>
          <div
            style={{
              display: 'flex',
              marginLeft: `${isReply ? '51px' : '24px'}`
            }}
          >
            <CommentCreateTime createdTime={commentObj.created_at} />
            {!isReply && (
              <ReplyWrapper onClick={toggleReplyInputOpen}>답글</ReplyWrapper>
            )}
            {isCommentAuthor && (
              <DeleteWrapper
                onClick={() => setIsDeleteDialogOpen(true)}
                id="delete-comment"
              >
                삭제
              </DeleteWrapper>
            )}
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {isCommentAuthor && (
            <div id="like-count" style={{ margin: '4px' }}>
              {likeCount}
            </div>
          )}
          {liked ? (
            <IconButton color="primary" size="small" onClick={toggleLike}>
              <FavoriteIcon className="unlike" color="primary" />
            </IconButton>
          ) : (
            <IconButton color="primary" size="small" onClick={toggleLike}>
              <FavoriteBorderIcon className="like" color="primary" />
            </IconButton>
          )}
        </div>
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
