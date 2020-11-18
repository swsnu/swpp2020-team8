import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import List from '@material-ui/core/List';
// import { useDispatch } from 'react-redux';
import ListItemLink from './ListItemLink';
import FriendItem from './FriendItem';

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

const QuestionSendModal = ({ questionObj, open, handleClose }) => {
  const classes = useStyles();

  const onClickSendButton = () => {};

  return (
    <Dialog fullWidth onClose={handleClose} maxWidth="sm" open={open}>
      <DialogTitle className={classes.modalTitle}>질문 보내기</DialogTitle>
      <DialogContent className={classes.content}>
        <Question>
          <h3>{questionObj.content}</h3>
        </Question>
        <List className={classes.list} aria-label="friend list">
          <ListItemLink to="/">
            <FriendItem username="jinsun.goo" />
          </ListItemLink>
          <ListItemLink to="/">
            <FriendItem username="curie.yoo" />
          </ListItemLink>
          <ListItemLink to="/">
            <FriendItem username="jaewon.kim" />
          </ListItemLink>
          <ListItemLink to="/">
            <FriendItem username="jina.park" />
          </ListItemLink>
        </List>
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
