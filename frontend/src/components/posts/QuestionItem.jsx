import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { TextareaAutosize } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import { PostItemHeaderWrapper, PostItemFooterWrapper } from '../../styles';

const QuestionItemWrapper = styled.div`
  background: #f4f4f4;
  padding: 12px;
  border-radius: 4px;
  margin: 8px 0;
  position: relative;
`;

const Question = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 15px;
`;

QuestionItemWrapper.displayName = 'QuestionItemWrapper';
TextareaAutosize.displayName = 'TextareaAutosize';

const useStyles = makeStyles((theme) => ({
  textArea: {
    background: 'transparent',
    width: '100%',
    border: 'none',
    resize: 'none',
    padding: theme.spacing(1),
    outline: 'none !important',
    boxSizing: 'border-box'
  }
}));

// TODO: share settings
export default function QuestionItem({ articleObj }) {
  // TODO: fix
  const isAuthor = true;

  const classes = useStyles();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isWriting, setIsWriting] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
  };

  const toggleIsWriting = () => {
    setIsWriting(!isWriting);
  };

  const handleSendButton = () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <QuestionItemWrapper>
      <PostItemHeaderWrapper>
        {articleObj.author_detail.username !== 'admin' && (
          <AuthorProfile author={articleObj.author_detail} />
        )}
        {articleObj.author_detail.username !== 'admin' && isAuthor && (
          <PostAuthorButtons
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
          />
        )}
      </PostItemHeaderWrapper>
      <Question>
        <Link to={`/questions/${articleObj.question_detail.id}`}>
          {articleObj.question_detail.question}
        </Link>
      </Question>
      <CreateTime createTime={articleObj.create_at} />
      <PostItemFooterWrapper>
        <IconButton color="secondary" size="small" onClick={handleSendButton}>
          <SendIcon color="secondary" />
        </IconButton>
        <IconButton color="secondary" size="small" onClick={toggleIsWriting}>
          <CreateIcon color="secondary" />
        </IconButton>
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
      {isWriting && (
        <TextareaAutosize
          className={classes.textArea}
          aria-label="new response"
          placeholder="답변을 작성해주세요."
        />
      )}
    </QuestionItemWrapper>
  );
}
