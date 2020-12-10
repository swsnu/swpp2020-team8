import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link, useHistory, useLocation } from 'react-router-dom';
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
import { PostItemHeaderWrapper, PostItemButtonsWrapper } from '../../styles';
import ShareSettings from './ShareSettings';
import QuestionSendModal from '../QuestionSendModal';
import { mockFriendList } from '../../constants';
import { likePost, unlikePost } from '../../modules/like';
import { deletePost } from '../../modules/post';
import AlertDialog from '../common/AlertDialog';

const QuestionItemWrapper = styled.div`
  @media (max-width: 650px) {
    border: 1px solid #e7e7e7;
    box-shadow: 0 2px 2px rgba(154, 160, 185, 0.05),
      0 5px 5px rgba(166, 173, 201, 0.1);
  }
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
  word-break: break-all;
  padding: 8px 0;
  @media (max-width: 650px) {
    padding: 16px;
  }
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

export default function QuestionItem({
  questionObj,
  onResetContent,
  questionId
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const isQuestionList = location.pathname === '/questions';
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const isAuthor = currentUser?.id === questionObj.author_detail.id;

  const classes = useStyles();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  useEffect(() => {
    setNewPost({
      question_id: questionId,
      question_detail: questionObj,
      content: '',
      type: 'Response'
    });
  }, [questionId, questionObj]);

  const handleContentChange = (e) => {
    setNewPost((prev) => ({
      ...prev,
      content: e.target.value
    }));
  };

  const toggleLike = () => {
    const postInfo = {
      target_type: questionObj.type,
      target_id: questionObj.id
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

  const toggleIsWriting = () => {
    setIsWriting(!isWriting);
  };

  const handleSendButton = () => {
    setQuestionSendModalOpen(true);
  };

  const handleModalClose = () => {
    setQuestionSendModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deletePost(questionObj.id, questionObj.type));
  };

  const resetContent = () => {
    setNewPost((prev) => ({ ...prev, content: '' }));
    if (onResetContent) onResetContent();
    setIsWriting(false);
    if (isQuestionList) history.push('/home');
  };

  return (
    <QuestionItemWrapper>
      <AlertDialog
        message="정말 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(true)}
        isOpen={isDeleteDialogOpen}
      />
      <PostItemHeaderWrapper>
        <AuthorProfile author={questionObj.author_detail} />
        {!questionObj.is_admin_question && isAuthor && (
          <PostAuthorButtons
            isQuestion
            onClickDelete={() => setIsDeleteDialogOpen(true)}
          />
        )}
      </PostItemHeaderWrapper>
      <Question>
        <Link to={`/questions/${questionObj.id}`}>{questionObj.content}</Link>
      </Question>
      <CreateTime createTime={questionObj.created_at} />
      <PostItemButtonsWrapper>
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
      </PostItemButtonsWrapper>
      {isWriting && (
        <>
          <TextareaAutosize
            className={classes.textArea}
            aria-label="new response"
            id="content-input"
            placeholder="답변을 작성해주세요."
            value={newPost.content}
            rowsMin={3}
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
