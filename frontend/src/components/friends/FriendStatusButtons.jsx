import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { acceptFriendRequest, deleteFriend } from '../../modules/friend';
import AlertDialog from '../common/AlertDialog';

const FriendButton = styled(Button)`
  padding: 5px 0 !important;
  margin: 0 4px;
`;

export default function FriendStatusButtons({ isFriend, friendObj }) {
  const dispatch = useDispatch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const onClickDeleteFriendButton = () => {
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDeleteFriend = () => {
    dispatch(deleteFriend(friendObj.id));
    setIsDeleteDialogOpen(false);
  };

  const onCancelDeleteFriend = () => {
    setIsDeleteDialogOpen(false);
  };

  const onClickDeleteRequestButton = () => {
    // todo: delete request action
  };
  const onClickAcceptRequestButton = () => {
    dispatch(acceptFriendRequest(friendObj));
    // todo: accept request action
  };

  return isFriend ? (
    <div id={friendObj.id}>
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
      <AlertDialog
        message="친구를 삭제하시겠습니까?"
        onConfirm={onConfirmDeleteFriend}
        onClose={onCancelDeleteFriend}
        isOpen={isDeleteDialogOpen}
      />
    </div>
  ) : (
    <div id={friendObj.id}>
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
