import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendStatusButtons from './FriendStatusButtons';

export const FriendItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  margin: ${(props) => (props.isWidget ? '8px 16px' : '8px 0')};
  padding: 6px;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
`;

FriendItemWrapper.displayName = 'FriendItemWrapper';
const FriendLink = styled(Link)`
  display: flex;
  align-items: center;
`;
const useStyles = makeStyles((theme) => ({
  username: {
    fontSize: 14,
    marginLeft: theme.spacing(1)
  }
}));

// eslint-disable-next-line react/prop-types
const FriendItem = ({
  friendObj,
  isWidget = false,
  requestId,
  isFriend,
  hasSentRequest,
  isPending
}) => {
  const classes = useStyles();
  const { username } = friendObj;
  return (
    <FriendItemWrapper isWidget={isWidget}>
      <FriendLink to={`/users/${friendObj.id}`}>
        <FaceIcon />
        <ListItemText
          classes={{ primary: classes.username }}
          primary={username}
        />
      </FriendLink>
      {!isWidget && (
        <FriendStatusButtons
          friendObj={friendObj}
          isFriend={isFriend}
          isPending={isPending}
          hasSentRequest={hasSentRequest}
          requestId={requestId}
        />
      )}
    </FriendItemWrapper>
  );
};

export default FriendItem;
