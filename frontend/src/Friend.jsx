import React from 'react';
import FriendItem from './components/friends/FriendItem';

export default function Friend() {
  const userObj = {
    id: 3,
    username: 'hong'
  };
  return (
    <div>
      <FriendItem
        friendObj={userObj}
        isFriend={false}
        isPending={false}
        hasSentRequest={false}
        requestId={7}
      />
      <FriendItem
        friendObj={userObj}
        isFriend={false}
        isPending
        hasSentRequest={false}
        requestId={10}
      />
      <FriendItem
        friendObj={userObj}
        isFriend={false}
        isPending={false}
        hasSentRequest
        requestId={7}
      />
      <FriendItem
        friendObj={userObj}
        isFriend
        isPending={false}
        hasSentRequest={false}
        requestId={7}
      />
    </div>
  );
}
