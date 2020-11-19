import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
// import { useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

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
  formControl: {
    margin: theme.spacing(3)
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

const QuestionSendModal = ({ questionObj, open, handleClose, friends }) => {
  const classes = useStyles();

  const FriendList = friends.map((friend) => {
    return (
      <FormControlLabel
        className={classes.friendlist}
        key={friend.id}
        control={<Checkbox name="checked" />}
        label={friend.username}
      />
    );
  });

  const onClickSendButton = () => {};

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
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>{FriendList}</FormGroup>
          {/* <FormHelperText>한 명 이상 선택해주세요!</FormHelperText> */}
        </FormControl>
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
