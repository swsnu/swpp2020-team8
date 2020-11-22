import React from 'react';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';

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
      {author.profile_pic ? (
        <ProfileImage
          id="profile-image"
          src={author.profile_pic}
          isComment={isComment}
        />
      ) : (
        <FaceIcon style={{ marginRight: '4px' }} />
      )}

      <div>{author.username}</div>
    </AuthorProfileWrapper>
  );
}
