import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  requestFriend,
  rejectFriendRequest
} from '../../modules/friend';
import AlertDialog from '../common/AlertDialog';

const FriendButton = styled(Button)`
  padding: 5px 0 !important;
  margin: 0 4px;
`;

// isFriend: 이미 친구
// isPending: 해당 유저가 나한테 보낸 요청이 있음 => 이 때는 requestId 필수
// hasSentRequest: 내가 유저한테 보낸 요청이 있음 => 이 때는 requestId 필수
export default function FriendStatusButtons({
  isFriend,
  isPending,
  hasSentRequest,
  friendObj
}) {
  const dispatch = useDispatch();
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRequestResetted, setIsRequestResetted] = useState(false);

  const currentUser = useSelector((state) => state.userReducer.currentUser);

  const onClickDeleteFriendButton = () => {
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDeleteFriend = () => {
    dispatch(deleteFriend(friendObj.id));
    setIsDeleteDialogOpen(false);
    setIsRequestResetted(true);
  };

  const onClickRejectRequestButton = () => {
    dispatch(rejectFriendRequest(friendObj.id));
    setIsRequestResetted(true);
  };
  const onCancelDeleteFriend = () => {
    setIsDeleteDialogOpen(false);
  };

  const onClickDeleteRequestButton = () => {
    dispatch(deleteFriendRequest(friendObj.id));
    setIsRequestResetted(true);
  };

  const onClickAcceptRequestButton = () => {
    dispatch(acceptFriendRequest(friendObj.id));
    setIsRequestAccepted(true);
  };

  const onClickRequestFriendButton = () => {
    dispatch(requestFriend(friendObj.id));
    setIsRequestResetted(false);
    setIsRequestSubmitted(true);
  };

  if (friendObj.id === currentUser?.id) return null;
  if (isRequestResetted)
    return (
      <div id={friendObj.id}>
        <FriendButton
          variant="outlined"
          color="primary"
          id="request-friend-button"
          onClick={onClickRequestFriendButton}
        >
          친구 요청
        </FriendButton>
      </div>
    );
  if (isFriend || isRequestAccepted)
    return (
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
    );
  if (isPending)
    return (
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
          onClick={onClickRejectRequestButton}
        >
          거절
        </FriendButton>
      </div>
    );

  if (hasSentRequest || isRequestSubmitted)
    return (
      <div id={friendObj.id}>
        <FriendButton
          variant="outlined"
          color="primary"
          id="has-sent-request-button"
        >
          요청됨
        </FriendButton>
        <FriendButton
          variant="outlined"
          color="secondary"
          id="sent-request-delete-button"
          onClick={onClickDeleteRequestButton}
        >
          취소
        </FriendButton>
      </div>
    );

  return (
    <div id={friendObj.id}>
      <FriendButton
        variant="outlined"
        color="primary"
        id="request-friend-button"
        onClick={onClickRequestFriendButton}
      >
        친구 요청
      </FriendButton>
    </div>
  );
}
