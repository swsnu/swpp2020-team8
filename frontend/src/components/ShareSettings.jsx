import React, { useState } from 'react';
import {
  FormGroup,
  FormControlLabel,
  Button,
  Checkbox
} from '@material-ui/core';
import styled from 'styled-components';

const ShareSettingsWrapper = styled.div`
  float: right;
  margin-bottom: auto;
`;

export default function ShareSettings() {
  const [shareState, setShareState] = useState({
    shareWithFriends: false,
    shareAnonymously: false
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setShareState((prev) => ({ ...prev, [name]: checked }));
  };

  const onClickSubmitButton = () => {
    setShareState({ shareWithFriends: false, shareAnonymously: false });
  };

  const controlShareWithFriends = (
    <Checkbox
      id="share-with-friends"
      name="shareWithFriends"
      checked={shareState.shareWithFriends}
      onChange={handleChange}
    />
  );

  const controlShareAnonymously = (
    <Checkbox
      id="share-anonymously"
      name="shareAnonymously"
      checked={shareState.shareAnonymously}
      onChange={handleChange}
    />
  );

  return (
    <ShareSettingsWrapper>
      <FormGroup row width="400px">
        <FormControlLabel
          className="share-with-friends"
          control={controlShareWithFriends}
          label="친구에게 공유하기"
        />

        <FormControlLabel
          className="share-anonymously"
          control={controlShareAnonymously}
          label="익명으로 공유하기"
        />
        <Button
          id="submit-button"
          size="medium"
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
