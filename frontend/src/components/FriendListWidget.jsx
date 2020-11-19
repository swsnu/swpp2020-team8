import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
// import ListItemLink from './ListItemLink';
// import FriendItem from './FriendItem';
import { WidgetWrapper, WidgetTitleWrapper } from '../styles';

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

  return (
    <WidgetWrapper>
      <Card className={classes.card} variant="outlined">
        <CardContent className={classes.cardContent}>
          <WidgetTitleWrapper>
            <Typography variant="h6" className={classes.title}>
              친구
            </Typography>
            <Button variant="outlined" size="small">
              친구 관리
            </Button>
          </WidgetTitleWrapper>
          <List className={classes.list} aria-label="friend list">
            {/* <ListItemLink to="/">
              <FriendItem username="jinsun.goo" />
            </ListItemLink>
            <ListItemLink to="/">
              <FriendItem username="curie.yoo" />
            </ListItemLink>
            <ListItemLink to="/">
              <FriendItem username="jaewon.kim" />
            </ListItemLink>
            <ListItemLink to="/">
              <FriendItem username="jina.park" />
            </ListItemLink> */}
          </List>
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
