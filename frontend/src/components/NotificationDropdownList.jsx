import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import NotificationItem from './NotificationItem';

const useStyles = makeStyles({
  notificationDropdown: {
    width: 300,
    maxHeight: 500,
    position: 'fixed',
    top: 68,
    right: 50,
    zIndex: 1
  },
  notificationDropdownContent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: '0 !important'
    }
  }
});

const NotificationDropdownList = () => {
  const classes = useStyles();

  return (
    <Card variant="outlined" className={classes.notificationDropdown}>
      <CardContent className={classes.notificationDropdownContent}>
        <List>
          <NotificationItem message="yuri.kim님이 친구 요청을 보냈습니다." />
          <NotificationItem
            message={'jina.park님이 "나에게 소개원실이란?" 질문을 보냈습니다.'}
          />
          <NotificationItem
            message={'jaewon.kim님이 당신의 댓글에 답글을 남겼습니다: "배고파"'}
          />
        </List>
      </CardContent>
    </Card>
  );
};

export default NotificationDropdownList;
