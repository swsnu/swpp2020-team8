import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import styled from 'styled-components';
import FriendStatusButtons from './FriendStatusButtons';

const FriendItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${(props) => (props.isWidget ? 'auto' : '8px 0')};
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
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.username }}
        primary={username}
      />
      {!isWidget && <FriendStatusButtons friendId={friendObj.id} isFriend />}
    </FriendItemWrapper>
  );
};

export default FriendItem;
