import React, { useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import QuestionBox from './QuestionBox';
import { PostItemHeaderWrapper, PostItemFooterWrapper } from '../../styles';
import CommentItem from '../comments/CommentItem';
import NewComment from '../comments/NewComment';

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

export default function PostItem({ postObj }) {
  // TODO: fix
  const isAuthor = true;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const commentList = postObj.comments.map((comment) => {
    return <CommentItem key={comment.id} commentObj={comment} />;
  });

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
        <AuthorProfile author={postObj.author_detail} />
        {isAuthor && (
          <PostAuthorButtons
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
          />
        )}
      </PostItemHeaderWrapper>
      {postObj.question_detail && (
        <QuestionBox questionObj={postObj.question_detail} />
      )}
      <ContentWrapper>{postObj.content}</ContentWrapper>
      <CreateTime createdTime={postObj.created_at} />
      <PostItemFooterWrapper>
        {liked ? (
          <IconButton color="primary" size="small" onClick={toggleLike}>
            <FavoriteIcon color="primary" />
          </IconButton>
        ) : (
          <IconButton color="primary" size="small" onClick={toggleLike}>
            <FavoriteBorderIcon color="primary" />
          </IconButton>
        )}
        {isAuthor && (
          <div id="like-count" style={{ margin: '4px' }}>
            {likeCount}
          </div>
        )}
      </PostItemFooterWrapper>
      <CommentWrapper>
        {commentList}
        <NewComment />
      </CommentWrapper>
    </PostItemWrapper>
  );
}
