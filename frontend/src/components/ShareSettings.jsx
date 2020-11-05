import React, { useState } from 'react';
import {
  FormGroup,
  FormControlLabel,
  Button,
  Checkbox
} from '@material-ui/core';

export default function ShareSettings() {
  const [shareState, setShareState] = useState({
    shareWithFriends: false,
    shareAnonymously: false
  });

  const onToggleChange = (e) => {
    const { name, checked } = e.target;
    setShareState((prev) => ({ ...prev, [name]: checked }));
  };

  const controlShareWithFriends = (
    <Checkbox
      id="share-with-friends"
      name="shareWithFriends"
      checked={shareState.shareWithFriends}
      onChange={onToggleChange}
    />
  );

  const controlShareAnonymously = (
    <Checkbox
      id="share-anonymously"
      name="shareAnonymously"
      checked={shareState.shareAnonymously}
      onChange={onToggleChange}
    />
  );

  const onClickSubmitButton = () => {};

  return (
    <FormGroup row width="400px">
      <FormControlLabel
        control={controlShareWithFriends}
        label="친구에게 공유하기"
      />

      <FormControlLabel
        control={controlShareAnonymously}
        label="익명으로 공유하기"
      />
      <Button
        id="submit-button"
        size="small"
        variant="contained"
        color="secondary"
        onClick={onClickSubmitButton}
      >
        게시
      </Button>
    </FormGroup>
  );
}
