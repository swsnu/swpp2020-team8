import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';

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
    <>
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.username }}
        primary={username}
      />
      {isWidget && <button type="button">should display buttons</button>}
    </>
  );
};

export default FriendItem;
