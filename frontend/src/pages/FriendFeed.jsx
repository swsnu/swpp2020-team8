import React from 'react';
import styled from 'styled-components';

const FriendFeedWrapper = styled.div`
  margin: 16px 0;
  width: 100vw;
  text-align: center;
`;

export default function FriendFeed() {
  return (
    <FriendFeedWrapper>
      <h1>Friend Feed</h1>
    </FriendFeedWrapper>
  );
}
