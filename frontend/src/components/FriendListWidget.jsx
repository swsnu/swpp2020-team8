import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import { WidgetWrapper, WidgetTitleWrapper } from '../styles';
import { getFriendList } from '../modules/friend';
import FriendItem from './friends/FriendItem';

const useStyles = makeStyles({
  card: {
    position: 'fixed',
    width: '275px',
    borderColor: '#eee',
    boxShadow:
      '0 5px 10px rgba(154, 160, 185, 0.05), 0 5px 10px rgba(166, 173, 201, 0.2)'
  },
  cardContent: {
    padding: '0 !important'
  },
  title: {
    fontWeight: 'bold'
  },
  list: {
    paddingTop: 0
  },
  friend: {
    fontSize: 14
  }
});

const FriendListWidget = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const friendList = useSelector((state) => state.friendReducer.friendList);

  useEffect(() => {
    dispatch(getFriendList());
  }, [dispatch]);

  const friendItemList = friendList?.map((friend) => {
    return <FriendItem key={friend.id} friendObj={friend} isWidget />;
  });

  return (
    <WidgetWrapper id="friend-list-widget">
      <Card className={classes.card} variant="outlined">
        <CardContent className={classes.cardContent}>
          <WidgetTitleWrapper>
            <Typography variant="h6" className={classes.title}>
              친구
            </Typography>
            <Link to="/my-friends">
              <Button variant="outlined" size="small">
                친구 관리
              </Button>
            </Link>
          </WidgetTitleWrapper>
          <List className={classes.list} aria-label="friend list">
            {friendItemList}
          </List>
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
