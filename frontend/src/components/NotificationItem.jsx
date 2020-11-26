import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import { useDispatch } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import { useHistory } from 'react-router-dom';
import { readNotification } from '../modules/notification';

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
    backgroundColor: 'rgb(255, 57, 91, 0.08)',
    '&:hover': {
      backgroundColor: 'rgb(255, 57, 91, 0.15) !important'
    }
  },
  notiLink: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    }
  }
}));

// eslint-disable-next-line react/prop-types
const NotificationItem = ({ notiObj, isNotificationPage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const link = `/${notiObj?.feed_type?.toLowerCase()}s/${notiObj.feed_id}`;

  const handleClickNotiItem = () => {
    dispatch(readNotification(notiObj.id));
    history.push(link);
  };

  return (
    <ListItem
      className={`${isNotificationPage && classes.notificationPageWrapper} ${
        !notiObj.is_read && classes.unread
      } ${classes.notiLink}`}
      onClick={handleClickNotiItem}
    >
      <FaceIcon />
      <ListItemText
        classes={{ primary: classes.message }}
        primary={notiObj.message}
      />
    </ListItem>
  );
};

export default NotificationItem;
