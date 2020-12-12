/* eslint-disable react/jsx-wrap-multilines */
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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

const ArticleInfo = styled.div`
  padding-top: 13px;
  margin: 0 8px;
  font-size: 10px;
  color: #999;
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
  postObj,
  isArticle = false
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const [shareState, setShareState] = useState({
    shareWithFriends: true,
    shareAnonymously: false
  });
  const [noContentDialogOpen, setNoContentDialogOpen] = useState(false);

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
    if (isArticle) {
      setShareState({ shareWithFriends: true, shareAnonymously: false });
    }
  }, [location, postObj]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setShareState((prev) => ({ ...prev, [name]: checked }));
  };

  const onClickSubmitButton = async () => {
    if (edit) {
      if (postObj?.content.trim() === '') {
        setNoContentDialogOpen(true);
        return;
      }
      const editedPostObj = {
        ...postObj,
        share_with_friends: shareState.shareWithFriends,
        share_anonymously: shareState.shareAnonymously
      };
      await dispatch(editSelectedPost(editedPostObj));
      history.push(location.pathname.slice(0, -4));
    } else {
      if (newPost?.content.trim() === '') {
        setNoContentDialogOpen(true);
        return;
      }
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
        {!isArticle && (
          <>
            <FormControlLabel
              className={`share-with-friends ${classes.label}`}
              control={controlShareWithFriends}
              label={
                <Typography className={classes.label}>
                  친구에게 공유하기
                </Typography>
              }
            />
            <FormControlLabel
              className={`share-anonymously ${classes.label}`}
              control={controlShareAnonymously}
              label={
                <Typography className={classes.label}>
                  익명으로 공유하기
                </Typography>
              }
            />
          </>
        )}
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
      {isArticle && (
        <ArticleInfo>
          질문, 답변을 제외한 게시글은 친구들에게만 공개됩니다.
        </ArticleInfo>
      )}
      <Dialog
        id="no-content-dialog"
        open={noContentDialogOpen}
        onClose={() => setNoContentDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            내용을 입력해주세요!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id="confirm-button"
            onClick={() => setNoContentDialogOpen(false)}
            color="primary"
            autoFocus
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </ShareSettingsWrapper>
  );
}
