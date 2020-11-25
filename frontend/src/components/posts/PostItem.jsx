import React, { useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import QuestionBox from './QuestionBox';
import {
  PostItemHeaderWrapper,
  PostItemFooterWrapper,
  PostItemWrapper
} from '../../styles';
import CommentItem from '../comments/CommentItem';
import { mockArticle } from '../../constants';

PostItemWrapper.displayName = 'PostItemWrapper';

const ContentWrapper = styled.div`
  margin: 12px 0;
`;

const CommentWrapper = styled.div``;

export default function PostItem({ postObj }) {
  const history = useHistory();

  const user = useSelector((state) => state.userReducer.user);
  const isAuthor = user.id === postObj.author_detail.id;

  const [liked, setLiked] = useState(postObj.current_user_liked);
  const [likeCount, setLikeCount] = useState(postObj.like_count);

  const commentList = mockArticle.comments?.map((comment) => {
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
  const handleEdit = () => {
    history.push(`/${postObj.type.toLowerCase()}s/${postObj.id}/edit`);
  };
  const handleDelete = () => {};

  return (
    <PostItemWrapper>
      <PostItemHeaderWrapper>
        <AuthorProfile author={postObj.author_detail} />
        {isAuthor && (
          <PostAuthorButtons
            isQuestion={false}
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
      <CommentWrapper>{commentList}</CommentWrapper>
    </PostItemWrapper>
  );
}
