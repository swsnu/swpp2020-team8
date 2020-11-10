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
const FriendItem = ({ username }) => {
  const classes = useStyles();

  return (
    <>
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.username }}
        primary={username}
      />
    </>
  );
};

export default FriendItem;
