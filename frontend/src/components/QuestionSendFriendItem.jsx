import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import { useSelector, useDispatch } from 'react-redux';
import { FriendItemWrapper } from './friends/FriendItem';
import {
  createResponseRequest,
  deleteResponseRequest
} from '../modules/question';

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

const useStyles = makeStyles((theme) => ({
  username: {
    fontSize: 14,
    marginLeft: theme.spacing(1)
  },
  button: {
    height: '30px'
  }
}));

const QuestionSendFriendItem = ({ questionObj, friendObj, sended }) => {
  const classes = useStyles();
  const { username } = friendObj;
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userReducer.currentUser);

  const handleSendResponseRequest = (questionId, requesteeId) => {
    const responseRequestObj = {
      requester_id: currentUser.id,
      requestee_id: requesteeId,
      question_id: questionId
    };
    dispatch(createResponseRequest(responseRequestObj));
  };
  const handleDeleteResponseRequest = (qid, rid) => {
    dispatch(deleteResponseRequest(qid, rid));
  };

  return (
    <FriendItemWrapper isWidget={false}>
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

export default QuestionSendFriendItem;
