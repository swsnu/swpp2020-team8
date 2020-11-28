import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getFriendList } from '../modules/friend';
import FriendItem from '../components/friends/FriendItem';

const FriendListWrapper = styled.div`
  padding: 16px;
  border: 1px solid whitesmoke;
  padding-top: 0;
  border-radius: 4px;
  background: whitesmoke;
`;

FriendListWrapper.displayName = 'FriendListWrapper';

export default function FriendsPage() {
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.friendReducer.friendList);

  useEffect(() => {
    dispatch(getFriendList());
  }, [dispatch]);

  const friendItemList = friendList?.map((friend) => {
    return <FriendItem key={friend.id} friendObj={friend} isFriend />;
  });
  return (
    <FriendListWrapper>
      <h3>
        친구 목록
        {`(${friendList?.length})`}
      </h3>
      {friendItemList}
    </FriendListWrapper>
  );
}
