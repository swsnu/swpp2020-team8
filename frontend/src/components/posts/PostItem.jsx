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
import { PostItemHeaderWrapper, PostItemFooterWrapper } from '../../styles';
import CommentItem from '../comments/CommentItem';
import NewComment from '../comments/NewComment';
import { createComment, deletePost } from '../../modules/post';
import { likePost, unlikePost } from '../../modules/like';
import AlertDialog from '../common/AlertDialog';

const PostItemWrapper = styled.div`
  background: #fff;
  padding: 16px;
  font-size: 14px;
  border: 1px solid #eee;
  margin: 16px 0;
  position: relative;
  border-radius: 4px;
`;

PostItemWrapper.displayName = 'PostItemWrapper';

const ContentWrapper = styled.div`
  margin: 12px 0;
`;

const CommentWrapper = styled.div``;

export default function PostItem({ postObj, postKey, isDetailPage }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const isAuthor = postObj?.author && user?.id === postObj.author_detail?.id;
  const isAnon = postObj?.author && !postObj?.author_detail?.id;
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
    const isCommentAuthor = comment.author_detail?.id === user.id;
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
    if (liked) {
      setLikeCount((prev) => prev - 1);
      dispatch(
        unlikePost({
          target_id: postObj.id
        })
      );
    } else {
      setLikeCount((prev) => prev + 1);
      dispatch(
        likePost({
          target_type: postObj.type,
          target_id: postObj.id
        })
      );
    }
    setLiked((prev) => !prev);
  };

  const handleEdit = () => {
    // todo: redirect to edit page
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
            onClickEdit={handleEdit}
            onClickDelete={() => setIsDeleteDialogOpen(true)}
          />
        )}
      </PostItemHeaderWrapper>
      {postObj.question && <QuestionBox questionObj={postObj.question} />}
      <ContentWrapper>{postObj.content}</ContentWrapper>
      <CreateTime createdTime={postObj.created_at} />
      <PostItemFooterWrapper>
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
