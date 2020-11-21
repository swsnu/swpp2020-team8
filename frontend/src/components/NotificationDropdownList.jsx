import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px 0px 16px;
}
`;

const NotificationDropdownList = ({ notifications, setIsNotiOpen }) => {
  const classes = useStyles();
  const notificationList = notifications.map((noti) => (
    <NotificationItem key={noti.id} notiObj={noti} />
  ));

  return (
    <Card variant="outlined" className={classes.notificationDropdown}>
      <ButtonWrapper>
        <Button
          component={Link}
          to="/notifications"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsNotiOpen(false);
          }}
        >
          알림 전체 보기
        </Button>
        <Button size="small">모두 읽음</Button>
      </ButtonWrapper>
      <CardContent className={classes.notificationDropdownContent}>
        <List>{notificationList}</List>
      </CardContent>
    </Card>
  );
};

export default NotificationDropdownList;
