import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendStatusButtons from './FriendStatusButtons';

const FriendItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${(props) => (props.isWidget ? 'auto' : '8px 0')};
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
const FriendItem = ({ friendObj, isWidget = false }) => {
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
      {!isWidget && <FriendStatusButtons friendObj={friendObj} isFriend />}
    </FriendItemWrapper>
  );
};

export default FriendItem;
