import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getFriendList } from '../modules/friend';
import FriendItem from '../components/friends/FriendItem';

const FriendListWrapper = styled.div`
  padding: 16px;
  border: 1px solid #e7e7e7;
  padding-top: 0;
  border-radius: 4px;
`;

export default function FriendsPage() {
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.friendReducer.friendList);

  useEffect(() => {
    dispatch(getFriendList());
  }, [dispatch]);

  const friendItemList = friendList.map((friend) => {
    return <FriendItem key={friend.id} friendObj={friend} />;
  });
  return (
    <FriendListWrapper>
      <h3>친구 목록</h3>
      {friendItemList}
    </FriendListWrapper>
  );
}
