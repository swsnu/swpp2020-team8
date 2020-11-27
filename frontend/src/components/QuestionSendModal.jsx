import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
// import { useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import { getFriendList } from '../modules/friend';
import { FriendItemWrapper } from './friends/FriendItem';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 550,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    outline: 0
  },
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
  }
}));

const SubmitButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const Question = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 15px;
`;

FriendItemWrapper.displayName = 'FriendItemWrapper';

const QuestionSendFriendItem = ({ friendObj, isWidget = false }) => {
  const classes = useStyles();
  const { username } = friendObj;
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <FriendItemWrapper isWidget={isWidget}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.username }}
        primary={username}
      />
    </FriendItemWrapper>
  );
};

const QuestionSendModal = ({ questionObj, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.friendReducer.friendList);

  useEffect(() => {
    dispatch(getFriendList());
  }, [dispatch]);

  const friendItemList = friendList?.map((friend) => {
    return (
      <QuestionSendFriendItem key={friend.id} friendObj={friend} isWidget />
    );
  });

  const onClickSendButton = () => {
    // TODO: question send API Linking
    handleClose();
  };

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
        <FormHelperText> 한 명 이상 선택해주세요 :)</FormHelperText>
        <SubmitButtonWrapper>
          <Button
            size="medium"
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={onClickSendButton}
          >
            보내기
          </Button>
        </SubmitButtonWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSendModal;