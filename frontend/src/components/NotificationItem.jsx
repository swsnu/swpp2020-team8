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
    border: '1px solid #e7e7e7',
    borderRadius: '4px'
  },
  unread: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)'
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
      }`}
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
