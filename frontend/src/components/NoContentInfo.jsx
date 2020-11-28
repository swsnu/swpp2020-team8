import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    width: '100%',
    boxShadow: 'none',
    border: '1px solid #eee',
    padding: '0'
  },
  cardContent: {
    padding: '24px !important'
  }
});

const NoContentInfo = ({ message }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>{message}</CardContent>
    </Card>
  );
};

export default NoContentInfo;
