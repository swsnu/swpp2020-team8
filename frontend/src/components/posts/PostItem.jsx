import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import QuestionBox from './QuestionBox';
import { PostItemHeaderWrapper, PostItemFooterWrapper } from '../../styles';
import CommentItem from '../comments/CommentItem';
import NewComment from '../comments/NewComment';
import { createComment } from '../../modules/post';

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

export default function PostItem({ postObj, postKey }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const isAuthor = postObj?.author && user?.id === postObj.author_detail?.id;
  const isAnon = postObj?.author && !postObj?.author_detail?.id;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (postObj) {
      const count = postObj.like_count;
      setLikeCount(+count);
      setLiked(postObj.current_user_liked);
    }
  }, [postObj]);

  const commentList = postObj?.comments?.map((comment) => {
    if (
      comment.is_private &&
      !isAuthor &&
      comment.author_detail?.id !== user.id
    )
      return null;
    return (
      <CommentItem postKey={postKey} key={comment.id} commentObj={comment} />
    );
  });

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
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
  };
  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <PostItemWrapper>
      <PostItemHeaderWrapper>
        <AuthorProfile author={postObj && postObj.author_detail} />
        {isAuthor && (
          <PostAuthorButtons
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
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
    </PostItemWrapper>
  );
}
