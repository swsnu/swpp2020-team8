/* eslint-disable react/button-has-type */
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { readAllNotification } from '../modules/notification';
import NotificationItem from './NotificationItem';

const useStyles = makeStyles({
  notificationDropdown: {
    width: 300,
    maxHeight: 500,
    overflow: 'scroll',
    position: 'fixed',
    top: 68,
    right: 50,
    zIndex: 1,
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 12px'
  },
  notificationDropdownContent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: '0 !important'
    }
  },
  notiButtons: {
    border: 'none',
    background: 'transparent',
    padding: '8px',
    '&:hover': {
      color: '#F12C56'
    }
  }
});

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px 0px 16px;
}
`;

const NotificationDropdownList = ({ notifications, setIsNotiOpen }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const notificationList = notifications?.map((noti) => (
    <NotificationItem key={`noti-${noti.id}`} notiObj={noti} />
  ));

  const handleReadAllNotification = () => {
    dispatch(readAllNotification());
  };
  return (
    <Card variant="outlined" className={classes.notificationDropdown}>
      {notifications?.length === 0 ? (
        <ListItem>
          <ListItemText
            classes={{ primary: classes.message }}
            primary="새로운 알림이 없습니다."
          />
        </ListItem>
      ) : (
        <>
          <ButtonWrapper>
            <button
              className={`all-notifications ${classes.notiButtons}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsNotiOpen(false);
                history.push('/notifications');
              }}
            >
              알림 전체 보기
            </button>
            <button
              className={`read-all-notifications ${classes.notiButtons}`}
              onClick={handleReadAllNotification}
            >
              모두 읽음
            </button>
          </ButtonWrapper>
          <CardContent className={classes.notificationDropdownContent}>
            <List>{notificationList}</List>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default NotificationDropdownList;
