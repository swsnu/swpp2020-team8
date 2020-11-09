import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItemLink from './ListItemLink';
import FriendItem from './FriendItem';
import { WidgetWrapper, WidgetTitleWrapper } from '../styles';

const useStyles = makeStyles({
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

  return (
    <WidgetWrapper>
      <Card variant="outlined">
        <CardContent className={classes.cardContent}>
          <WidgetTitleWrapper>
            <Typography variant="h6" className={classes.title}>
              친구
            </Typography>
            <Button component="a" href="" variant="outlined" size="small">
              친구 관리
            </Button>
          </WidgetTitleWrapper>
          <List className={classes.list} aria-label="friend list">
            <ListItemLink href="">
              <FriendItem username="jinsun.goo" />
            </ListItemLink>
            <ListItemLink href="">
              <FriendItem username="curie.yoo" />
            </ListItemLink>
            <ListItemLink href="">
              <FriendItem username="jaewon.kim" />
            </ListItemLink>
            <ListItemLink href="">
              <FriendItem username="jina.park" />
            </ListItemLink>
          </List>
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
