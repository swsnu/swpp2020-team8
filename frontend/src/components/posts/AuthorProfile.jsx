import React from 'react';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';
import { useHistory, useLocation } from 'react-router-dom';

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
  const history = useHistory();
  const isAnonFeed = location.pathname === '/anonymous';

  if (!author) return null;
  const { id, username, profile_pic: picHex, color_hex: hex } = author;

  const onClickProfile = () => {
    if (id) history.push(`/users/${id}`);
  };
  return (
    <AuthorProfileWrapper onClick={onClickProfile}>
      {id && (!isAnonFeed || isAuthor) ? (
        <FaceIcon
          style={{
            color: picHex,
            marginRight: '4px',
            width: isComment && '20px',
            opacity: 0.8,
            top: '2px',
            position: 'relative'
          }}
        />
      ) : (
        <AnonIcon
          style={{
            marginRight: '4px',
            width: isComment && '20px',
            height: isComment && '20px',
            top: '2px',
            position: 'relative'
          }}
          hex={hex}
        />
      )}

      {username && (!isAnonFeed || isAuthor) && (
        <div
          style={{
            minWidth: 'max-content',
            fontSize: isComment ? '12px' : '14px'
          }}
        >
          {username}
        </div>
      )}
    </AuthorProfileWrapper>
  );
}
