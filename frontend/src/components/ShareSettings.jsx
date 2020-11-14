import React, { useState } from 'react';
import {
  FormGroup,
  FormControlLabel,
  Button,
  Checkbox
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { createPost } from '../modules/post';

const ShareSettingsWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  font-size: 14px;
`;

const useStyles = makeStyles(() => ({
  label: {
    fontSize: '14px'
  }
}));

export default function ShareSettings({ newPost, resetContent }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [shareState, setShareState] = useState({
    shareWithFriends: true,
    shareAnonymously: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setShareState((prev) => ({ ...prev, [name]: checked }));
  };

  const onClickSubmitButton = () => {
    if (!newPost.content) return;
    const postObj = {
      ...shareState,
      ...newPost
    };
    dispatch(createPost(postObj));
    setShareState({ shareWithFriends: true, shareAnonymously: false });
    resetContent();
  };

  const controlShareWithFriends = (
    <Checkbox
      id="share-with-friends"
      name="shareWithFriends"
      checked={shareState.shareWithFriends}
      onChange={handleChange}
      size="small"
    />
  );

  const controlShareAnonymously = (
    <Checkbox
      id="share-anonymously"
      name="shareAnonymously"
      checked={shareState.shareAnonymously}
      onChange={handleChange}
      size="small"
    />
  );

  return (
    <ShareSettingsWrapper>
      <FormGroup row width="400px">
        <FormControlLabel
          className={`share-with-friends ${classes.label}`}
          control={controlShareWithFriends}
          label={
            <Typography className={classes.label}>친구에게 공유하기</Typography>
          }
        />
        <FormControlLabel
          className={`share-anonymously ${classes.label}`}
          control={controlShareAnonymously}
          label={
            <Typography className={classes.label}>익명으로 공유하기</Typography>
          }
        />
        <Button
          id="submit-button"
          size="small"
          variant="outlined"
          color="secondary"
          onClick={onClickSubmitButton}
        >
          게시
        </Button>
      </FormGroup>
    </ShareSettingsWrapper>
  );
}
