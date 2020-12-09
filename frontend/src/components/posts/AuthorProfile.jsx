import React from 'react';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';
import { useLocation } from 'react-router-dom';

const AuthorProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
`;
const AnonIcon = styled.div`
  border-radius: 50%;
  width: 26px;
  height: 26px;
  background: ${(props) => (props.hex ? props.hex : '#f12c56')};
`;
AnonIcon.displayName = 'AnonIcon';

export default function AuthorProfile({
  author,
  isComment = false,
  isAuthor = false
}) {
  const location = useLocation();
  const isAnonFeed = location.pathname === '/anonymous';

  if (!author) return null;
  const { id, username, profile_pic: picHex, color_hex: hex } = author;
  return (
    <AuthorProfileWrapper>
      {id && (!isAnonFeed || isAuthor) ? (
        <FaceIcon
          style={{
            color: picHex,
            marginRight: '4px',
            width: isComment && '20px',
            opacity: 0.8
          }}
        />
      ) : (
        <AnonIcon style={{ marginRight: '4px' }} hex={hex} />
      )}

      {username && (!isAnonFeed || isAuthor) && (
        <div style={{ fontSize: isComment ? '12px' : '14px' }}>{username}</div>
      )}
    </AuthorProfileWrapper>
  );
}
