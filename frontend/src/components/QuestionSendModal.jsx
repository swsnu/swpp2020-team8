import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import styled from 'styled-components';
import { getResponseRequestsByQuestion } from '../modules/question';
import QuestionSendFriendItem from './QuestionSendFriendItem';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(1, 2, 2, 2)
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    paddingBottom: 0
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  list: {
    paddingTop: 0
  }
}));

const Question = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 15px;
`;

const QuestionSendModal = ({ questionObj, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.friendReducer.friendList);
  const responseRequests = useSelector(
    (state) => state.questionReducer.responseRequests
  );

  useEffect(() => {
    dispatch(getResponseRequestsByQuestion(questionObj.id));
  }, [dispatch, questionObj]);

  const friendItemList = friendList?.map((friend) => {
    return (
      <QuestionSendFriendItem
        key={friend.id}
        questionObj={questionObj}
        friendObj={friend}
        isWidget
        sended={responseRequests?.find((r) => r.recipient_id === friend.id)}
      />
    );
  });

  return (
    <Dialog fullWidth onClose={handleClose} maxWidth="sm" open={open}>
      <DialogTitle className={classes.modalTitle} onClose={handleClose}>
        질문 보내기
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Question>
          <h3>{questionObj.content}</h3>
        </Question>
        <List className={classes.list} aria-label="friend list">
          {friendItemList}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSendModal;
