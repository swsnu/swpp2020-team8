import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import ListItemLink from './ListItemLink';

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: 14,
    marginLeft: theme.spacing(2)
  }
}));

// eslint-disable-next-line react/prop-types
const NotificationItem = ({ link, message }) => {
  const classes = useStyles();
  return (
    <ListItemLink href={link}>
      <FaceIcon />
      <ListItemText classes={{ primary: classes.message }} primary={message} />
    </ListItemLink>
  );
};

export default NotificationItem;
