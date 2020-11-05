import React from 'react';
import styled from 'styled-components';

const AuthorProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ProfileImage = styled.img`
  border-radius: 50%;
  margin-right: 8px;
  width: ${(props) => (props.isComment ? '20px' : '30px')};
`;
export default function AuthorProfile({ author, isComment = false }) {
  return (
    <AuthorProfileWrapper>
      <ProfileImage src={author.profile_pic} isComment={isComment} />
      <div>{author.username}</div>
    </AuthorProfileWrapper>
  );
}
