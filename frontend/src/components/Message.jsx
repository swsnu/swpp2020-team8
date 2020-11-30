import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    width: '100%',
    borderColor: '#eee'
  },
  cardContent: {
    padding: '16px'
  },
  title: {
    marginTop: 0,
    textAlign: 'center'
  },
  detail: {
    textAlign: 'center'
  }
});

const Message = ({ message, messageDetail }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.cardContent}>
        {message && <h2 className={classes.title}>{message}</h2>}
        {messageDetail && <div className={classes.detail}>{messageDetail}</div>}
      </CardContent>
    </Card>
  );
};

export default Message;
