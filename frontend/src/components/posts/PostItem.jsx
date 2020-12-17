import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
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
  white-space: pre-wrap;
`;

const CommentWrapper = styled.div``;
const ShareSettingsWrapper = styled.div``;
const ShareSettingInfo = styled.span`
  margin-right: 4px;
  color: #777;
  font-size: 12px;
`;

const CommentInfo = styled.div`
  margin-left: 3px;
  margin-bottom: 8px;
  color: #aaa;
  font-size: 10px;
`;

export default function PostItem({
  postObj,
  postKey,
  isDetailPage,
  resetAfterComment
}) {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const isAuthor =
    postObj?.author && currentUser?.id === postObj.author_detail?.id;
  const isAnon =
    !postObj?.author_detail?.id ||
    pathname?.includes('anonymous') ||
    search?.includes('anonymous=True');
  const onlyAnonPost =
    postObj?.share_anonymously && !postObj?.share_with_friends;
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
    const isCommentAuthor = comment.author_detail?.id === currentUser?.id;
    if (comment.is_private && !(isAuthor || isCommentAuthor)) return null;
    return (
      <CommentItem
        isAnon={isAnon || onlyAnonPost}
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
      is_private: isPrivate,
      is_anonymous: isAnon || onlyAnonPost
    };
    dispatch(createComment(newCommentObj, postKey, postObj?.question_id));
    if (resetAfterComment) resetAfterComment();
  };

  const toggleLike = () => {
    const postInfo = {
      target_type: postObj.type,
      target_id: postObj.id,
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
        <AuthorProfile
          author={postObj && postObj.author_detail}
          isAuthor={isAuthor}
        />
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
          {isAuthor && (
            <>
              {(postObj.share_with_friends || postObj.share_anonymously) && (
                <ShareSettingInfo id="share-title">공개범위:</ShareSettingInfo>
              )}
              {postObj.share_with_friends && (
                <ShareSettingInfo id="share-with-friends">
                  친구
                </ShareSettingInfo>
              )}
              {postObj.share_with_friends && postObj.share_anonymously && (
                <ShareSettingInfo>|</ShareSettingInfo>
              )}
              {postObj.share_anonymously && (
                <ShareSettingInfo id="share-with-anon">익명</ShareSettingInfo>
              )}
            </>
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
      <div style={{ borderTop: '1px solid #eee', margin: '8px 0' }} />
      <>
        <CommentWrapper>{commentList}</CommentWrapper>
        <NewComment isAnon={isAnon} onSubmit={handleSubmit} />
        <CommentInfo>
          작성된 댓글은
          {isAnon || onlyAnonPost ? ' 익명피드에만  ' : ' 친구들에게만 '}
          공개됩니다.
        </CommentInfo>
      </>
      <AlertDialog
        message="정말 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onClose={onCancelDelete}
        isOpen={isDeleteDialogOpen}
      />
    </PostItemWrapper>
  );
}
