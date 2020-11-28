import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import QuestionBox from './QuestionBox';
import {
  PostItemHeaderWrapper,
  PostItemFooterWrapper,
  PostItemWrapper,
  PostItemButtonsWrapper
} from '../../styles';
import CommentItem from '../comments/CommentItem';
import NewComment from '../comments/NewComment';
import { likePost, unlikePost } from '../../modules/like';
import { createComment, deletePost } from '../../modules/post';
import AlertDialog from '../common/AlertDialog';

PostItemWrapper.displayName = 'PostItemWrapper';

const ContentWrapper = styled.div`
  margin: 12px 0;
`;

const CommentWrapper = styled.div``;
const ShareSettingsWrapper = styled.div``;
const ShareSettingInfo = styled.span`
  margin-right: 4px;
  color: #777;
  font-size: 12px;
`;

export default function PostItem({ postObj, postKey, isDetailPage }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const isAuthor =
    postObj?.author && currentUser?.id === postObj.author_detail?.id;
  const isAnon = !postObj?.author_detail?.id;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (postObj) {
      const count = postObj.like_count;
      setLikeCount(+count);
      setLiked(postObj.current_user_liked);
    }
  }, [postObj]);

  const commentList = postObj?.comments?.map((comment) => {
    if (!comment) return null;
    const isCommentAuthor = comment.author_detail?.id === currentUser.id;
    if (comment.is_private && !isAuthor && !isCommentAuthor) return null;
    return (
      <CommentItem
        postKey={postKey}
        key={comment.id}
        commentObj={comment}
        isAuthor={isAuthor}
      />
    );
  });

  const onCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = (content, isPrivate) => {
    const newCommentObj = {
      target_type: postObj.type,
      target_id: postObj.id,
      content,
      is_private: isPrivate
    };
    dispatch(createComment(newCommentObj));
  };

  const toggleLike = () => {
    const postInfo = {
      target_type: postObj.type,
      target_id: postObj.id
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

  const handleEdit = () => {
    history.push(`/${postObj.type.toLowerCase()}s/${postObj.id}/edit`);
  };

  const handleDelete = () => {
    dispatch(deletePost(postObj.id, postObj.type));
    setIsDeleteDialogOpen(false);
    if (isDetailPage) history.replace('/');
  };

  return (
    <PostItemWrapper>
      <PostItemHeaderWrapper>
        <AuthorProfile author={postObj && postObj.author_detail} />
        {isAuthor && (
          <PostAuthorButtons
            isQuestion={false}
            onClickEdit={handleEdit}
            onClickDelete={() => setIsDeleteDialogOpen(true)}
          />
        )}
      </PostItemHeaderWrapper>
      {postObj.question && <QuestionBox questionObj={postObj.question} />}
      <ContentWrapper>{postObj.content}</ContentWrapper>
      <CreateTime createdTime={postObj.created_at} />
      <PostItemFooterWrapper>
        <ShareSettingsWrapper>
          <ShareSettingInfo>공개범위:</ShareSettingInfo>
          {isAuthor && postObj.share_with_friends && (
            <ShareSettingInfo>친구</ShareSettingInfo>
          )}
          {isAuthor &&
            postObj.share_with_friends &&
            postObj.share_anonymously && <ShareSettingInfo>|</ShareSettingInfo>}
          {isAuthor && postObj.share_anonymously && (
            <ShareSettingInfo>익명</ShareSettingInfo>
          )}
        </ShareSettingsWrapper>
        <PostItemButtonsWrapper>
          {liked ? (
            <IconButton color="primary" size="small" onClick={toggleLike}>
              <FavoriteIcon className="unlike" color="primary" />
            </IconButton>
          ) : (
            <IconButton color="primary" size="small" onClick={toggleLike}>
              <FavoriteBorderIcon className="like" color="primary" />
            </IconButton>
          )}
          {isAuthor && (
            <div id="like-count" style={{ margin: '4px' }}>
              {likeCount}
            </div>
          )}
        </PostItemButtonsWrapper>
      </PostItemFooterWrapper>
      {!isAnon && (
        <>
          <NewComment onSubmit={handleSubmit} />
          <CommentWrapper>{commentList}</CommentWrapper>
        </>
      )}
      <AlertDialog
        message="정말 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onClose={onCancelDelete}
        isOpen={isDeleteDialogOpen}
      />
    </PostItemWrapper>
  );
}
