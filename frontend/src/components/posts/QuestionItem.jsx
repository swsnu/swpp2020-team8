import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
import ShareSettings from '../ShareSettings';
import QuestionSendModal from '../QuestionSendModal';
import { mockFriendList } from '../../constants';

const QuestionItemWrapper = styled.div`
  background: #f4f4f4;
  padding: 12px;
  border-radius: 4px;
  margin: 16px 0;
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
    background: 'white',
    width: '100%',
    border: 'none',
    resize: 'none',
    padding: theme.spacing(1),
    outline: 'none !important',
    boxSizing: 'border-box',
    margin: '8px 0',
    fontFamily: 'Noto Sans KR',
    fontsize: '14px'
  }
}));

// TODO: share settings
export default function QuestionItem({ questionObj }) {
  const user = useSelector((state) => state.userReducer.user);
  const isAuthor = user.id === questionObj.author_detail.id;

  const classes = useStyles();
  const [liked, setLiked] = useState(questionObj.current_user_liked);
  const [likeCount, setLikeCount] = useState(questionObj.like_count);
  const [isWriting, setIsWriting] = useState(false);
  const [newPost, setNewPost] = useState({
    question_id: questionObj?.id,
    question_detail: questionObj,
    content: '',
    type: 'Response'
  });
  const [isQuestionSendModalOpen, setQuestionSendModalOpen] = useState(false);

  const handleContentChange = (e) => {
    setNewPost((prev) => ({
      ...prev,
      content: e.target.value
    }));
  };

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

  const handleSendButton = () => {
    setQuestionSendModalOpen(true);
  };

  const handleModalClose = () => {
    setQuestionSendModalOpen(false);
  };

  const handleEdit = () => {};
  const handleDelete = () => {};

  const resetContent = () => {
    setNewPost((prev) => ({ ...prev, content: '' }));
  };

  return (
    <QuestionItemWrapper>
      <PostItemHeaderWrapper>
        {!questionObj.is_admin_question && (
          <AuthorProfile author={questionObj.author_detail} />
        )}
        {!questionObj.is_admin_question && isAuthor && (
          <PostAuthorButtons
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
          />
        )}
      </PostItemHeaderWrapper>
      <Question>
        <Link to={`/questions/${questionObj.id}`}>{questionObj.content}</Link>
      </Question>
      <CreateTime createTime={questionObj.created_at} />
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
        <>
          <TextareaAutosize
            className={classes.textArea}
            aria-label="new response"
            id="content-input"
            placeholder="답변을 작성해주세요."
            value={newPost.content}
            onChange={handleContentChange}
          />
          <ShareSettings newPost={newPost} resetContent={resetContent} />
        </>
      )}
      {isQuestionSendModalOpen && (
        <QuestionSendModal
          questionObj={questionObj}
          open={isQuestionSendModalOpen}
          handleClose={handleModalClose}
          friends={mockFriendList}
        />
      )}
    </QuestionItemWrapper>
  );
}
