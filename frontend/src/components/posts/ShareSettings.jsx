/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
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
import { useLocation, useHistory } from 'react-router-dom';
import { createPost, editSelectedPost } from '../../modules/post';

const RespFormGroup = styled(FormGroup)`
  @media (max-width: 650px) {
    // flex-direction: row-reverse;
    flex-direction: row;
    justify-content: flex-end;
    button {
      width: 30%;
    }
  }
`;

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

export default function ShareSettings({
  newPost,
  resetContent,
  edit,
  postObj
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const [shareState, setShareState] = useState({
    shareWithFriends: true,
    shareAnonymously: false
  });

  useEffect(() => {
    if (location.pathname === '/anonymous') {
      setShareState({ shareWithFriends: false, shareAnonymously: true });
    } else if (
      location.pathname?.includes('/articles') ||
      location.pathname?.includes('/responses')
    ) {
      const { share_with_friends, share_anonymously } = postObj;
      setShareState({
        shareWithFriends: share_with_friends,
        shareAnonymously: share_anonymously
      });
    }
  }, [location, postObj]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setShareState((prev) => ({ ...prev, [name]: checked }));
  };

  const onClickSubmitButton = async () => {
    if (edit) {
      const editedPostObj = {
        ...postObj,
        share_with_friends: shareState.shareWithFriends,
        share_anonymously: shareState.shareAnonymously
      };
      await dispatch(editSelectedPost(editedPostObj));
      history.push(location.pathname.slice(0, -4));
    } else {
      const newPostObj = {
        ...shareState,
        ...newPost
      };
      dispatch(createPost(newPostObj));
      resetContent();
      if (location.pathname === '/anonymous') {
        setShareState({ shareWithFriends: false, shareAnonymously: true });
      } else {
        setShareState({ shareWithFriends: true, shareAnonymously: false });
      }
    }
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
      <RespFormGroup row width="400px">
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
          disabled={
            (!shareState.shareAnonymously && !shareState.shareWithFriends) ||
            (edit ? !postObj?.content : !newPost?.content)
          }
        >
          게시
        </Button>
      </RespFormGroup>
    </ShareSettingsWrapper>
  );
}
