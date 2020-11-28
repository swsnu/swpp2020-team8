import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize, Button } from '@material-ui/core';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { createPost } from '../modules/post';

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

const CustomQuestionModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [newCustomQuestion, setNewCustomQuestion] = useState({
    content: '',
    type: 'Question',
    shareWithFriends: true,
    shareAnonymously: true
  });

  const handleInputChange = (e) => {
    setNewCustomQuestion((prev) => ({
      ...prev,
      content: e.target.value
    }));
  };

  const onClickSubmitButton = () => {
    dispatch(createPost(newCustomQuestion));
    handleClose();
  };

  return (
    <Dialog fullWidth onClose={handleClose} maxWidth="sm" open={open}>
      <DialogTitle className={classes.modalTitle}>새로운 질문</DialogTitle>
      <DialogContent className={classes.content}>
        <TextareaAutosize
          id="new-custom-question"
          className={classes.textArea}
          aria-label="new custom question"
          placeholder="새로운 질문을 작성해 보세요."
          rowsMin={3}
          value={newCustomQuestion.content}
          onChange={handleInputChange}
        />
        <SubmitButtonWrapper>
          <Button
            size="medium"
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={onClickSubmitButton}
          >
            게시
          </Button>
          <div className={classes.submitDetail}>
            질문은 모든 피드에 공개됩니다.
          </div>
        </SubmitButtonWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default CustomQuestionModal;
