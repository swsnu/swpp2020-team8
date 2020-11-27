import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import { FriendItemWrapper } from './friends/FriendItem';
import {
  getResponseRequestsByQuestion,
  createResponseRequest,
  deleteResponseRequest
} from '../modules/question';

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
  submitButton: {
    boxShadow: 'none',
    opacity: 0.8,
    '&:hover': {
      boxShadow: 'none',
      opacity: 1
    }
  },
  submitDetail: {
    fontSize: '12px',
    color: 'grey',
    marginRight: theme.spacing(1)
  },
  list: {
    paddingTop: 0
  },
  friend: {
    fontSize: 14
  },
  username: {
    fontSize: 14,
    marginLeft: theme.spacing(1)
  },
  button: {
    height: '30px'
  }
}));

const SendButton = withStyles({
  root: {
    boxShadow: 'none',
    outline: 'none',
    opacity: 0.8,
    '&:hover': {
      boxShadow: 'none',
      opacity: 1
    },
    '&:active': {
      boxShadow: 'none',
      opacity: 1
    }
  }
})(Button);

const Question = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 15px;
`;

FriendItemWrapper.displayName = 'FriendItemWrapper';

const QuestionSendFriendItem = ({
  questionObj,
  friendObj,
  isWidget = false,
  sended,
  handleSendResponseRequest,
  handleDeleteResponseRequest
}) => {
  const classes = useStyles();
  const { username } = friendObj;

  return (
    <FriendItemWrapper isWidget={isWidget}>
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.username }}
        primary={username}
      />
      {sended ? (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          className={classes.button}
          onClick={() => {
            handleDeleteResponseRequest(questionObj.id, friendObj.id);
          }}
        >
          보내기 취소
        </Button>
      ) : (
        <SendButton
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={() => {
            handleSendResponseRequest(questionObj.id, friendObj.id);
          }}
        >
          보내기
        </SendButton>
      )}
    </FriendItemWrapper>
  );
};

const QuestionSendModal = ({ questionObj, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.friendReducer.friendList);
  const responseRequests = useSelector(
    (state) => state.questionReducer.responseRequests
  );

  useEffect(() => {
    dispatch(getResponseRequestsByQuestion(questionObj.id));
  }, [dispatch]);

  const handleSendResponseRequest = (qid, rid) => {
    dispatch(createResponseRequest(qid, rid));
  };
  const handleDeleteResponseRequest = (qid, rid) => {
    dispatch(deleteResponseRequest(qid, rid));
  };

  const friendItemList = friendList?.map((friend) => {
    return (
      <QuestionSendFriendItem
        key={friend.id}
        questionObj={questionObj}
        friendObj={friend}
        isWidget
        sended={responseRequests?.find((r) => r.recipient_id === friend.id)}
        handleSendResponseRequest={handleSendResponseRequest}
        handleDeleteResponseRequest={handleDeleteResponseRequest}
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
