import React from 'react';
import { Button } from '@material-ui/core';

import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deleteFriend } from '../../modules/friend';

const FriendButton = styled(Button)`
  padding: 5px 0 !important;
  margin: 0 4px;
`;

export default function FriendStatusButtons({ isFriend, friendId }) {
  const dispatch = useDispatch();
  const onClickDeleteFriendButton = () => {
    dispatch(deleteFriend(friendId));
  };
  const onClickDeleteRequestButton = () => {};
  const onClickAcceptRequestButton = () => {};
  return isFriend ? (
    <div id={friendId}>
      <FriendButton
        variant="outlined"
        color="primary"
        id="friend-status-button"
      >
        친구 ✓
      </FriendButton>
      <FriendButton
        variant="outlined"
        color="secondary"
        id="friend-delete-button"
        onClick={onClickDeleteFriendButton}
      >
        삭제
      </FriendButton>
    </div>
  ) : (
    <div id={friendId}>
      <FriendButton
        variant="outlined"
        color="primary"
        id="request-accept-button"
        onClick={onClickAcceptRequestButton}
      >
        수락
      </FriendButton>
      <FriendButton
        variant="outlined"
        color="secondary"
        id="request-delete-button"
        onClick={onClickDeleteRequestButton}
      >
        거절
      </FriendButton>
    </div>
  );
}
