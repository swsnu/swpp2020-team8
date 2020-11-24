import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getSelectedUser } from '../modules/user';
import FriendItem from '../components/friends/FriendItem';

const FriendListWrapper = styled.div`
  padding: 16px;
  border: 1px solid whitesmoke;
  padding-top: 0;
  border-radius: 4px;
  background: whitesmoke;
`;

FriendListWrapper.displayName = 'FriendListWrapper';

export default function SearchResultPage() {
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.userReducer.selectedUser);

  useEffect(() => {
    dispatch(getSelectedUser());
  }, [dispatch]);

  const friendItemList = friendList?.map((friend) => {
    return <FriendItem key={friend.id} friendObj={friend} />;
  });
  return (
    <FriendListWrapper>
      <h3>
        검색 결과
        {`(${friendList?.length})`}
      </h3>
      {friendItemList}
    </FriendListWrapper>
  );
}
