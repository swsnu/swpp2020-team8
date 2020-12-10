import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { useHistory } from 'react-router-dom';
import FaceIcon from '@material-ui/icons/Face';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { readNotification } from '../modules/notification';
import { getCreatedTime } from '../utils/dateTimeHelpers';

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: 14,
    marginLeft: theme.spacing(1)
  },
  listItemWrapper: {
    display: 'block !important'
  },
  notificationPageWrapper: {
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

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AnonIcon = styled.div`
  border-radius: 50%;
  width: 21px;
  height: 21px;
  background: ${(props) => (props.hex ? props.hex : '#f12c56')};
  margin-right: 4px;
  margin-left: 2px;
`;
AnonIcon.displayName = 'AnonIcon';

const NotiCreatedAt = styled.div`
  color: #bbb;
  font-size: 12px;
  margin-left: 35px;
`;

// eslint-disable-next-line react/prop-types
const NotificationItem = ({ notiObj, isNotificationPage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClickNotiItem = () => {
    dispatch(readNotification(notiObj.id));
    history.push(notiObj.redirect_url);
  };

  const { id, profile_pic: picHex, color_hex: hex } = notiObj.actor_detail;

  return (
    <ListItem
      className={`${isNotificationPage && classes.notificationPageWrapper} ${
        !notiObj.is_read && classes.unread
      } ${classes.notiLink} ${classes.listItemWrapper}`}
      onClick={handleClickNotiItem}
    >
      <MessageWrapper>
        {id ? (
          <FaceIcon
            style={{
              color: picHex,
              marginRight: '4px',
              opacity: 0.8,
              top: '2px',
              position: 'relative'
            }}
          />
        ) : (
          <AnonIcon hex={hex} />
        )}
        <ListItemText
          classes={{ primary: classes.message }}
          primary={
            notiObj.is_response_request
              ? `${notiObj.message} - ${notiObj.question_content}`
              : notiObj.message
          }
        />
      </MessageWrapper>
      <NotiCreatedAt>{getCreatedTime(notiObj.created_at)}</NotiCreatedAt>
    </ListItem>
  );
};

export default NotificationItem;
