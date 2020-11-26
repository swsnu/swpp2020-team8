import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import ListItemLink from './ListItemLink';

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: 14,
    marginLeft: theme.spacing(1)
  },
  notificationPageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    margin: '8px 0',
    padding: '10px 6px',
    borderRadius: '4px'
  },
  unread: {
    backgroundColor: 'rgb(255, 57, 91, 0.08)',
    '&:hover': {
      backgroundColor: 'rgb(255, 57, 91, 0.15) !important'
    }
  }
}));

// eslint-disable-next-line react/prop-types
const NotificationItem = ({ notiObj, isNotificationPage }) => {
  const classes = useStyles();

  return (
    <ListItemLink
      to={notiObj.link}
      className={`${isNotificationPage && classes.notificationPageWrapper} ${
        !notiObj.is_read && classes.unread
      } ${classes.notiLink}`}
    >
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.message }}
        primary={notiObj.message}
      />
    </ListItemLink>
  );
};

export default NotificationItem;
