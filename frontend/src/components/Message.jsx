import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    width: '100%',
    borderColor: '#eee'
  },
  nonBorderCard: {
    width: '100%',
    border: 'none'
  },
  cardContent: {
    padding: '16px !important'
  },
  title: {
    margin: 0,
    textAlign: 'center'
  },
  detail: {
    textAlign: 'center',
    marginTop: '16px'
  }
});

const Message = ({ message, messageDetail, noBorder }) => {
  const classes = useStyles();
  return (
    <Card
      className={noBorder ? classes.nonBorderCard : classes.card}
      variant="outlined"
    >
      <CardContent className={classes.cardContent}>
        {message && <h2 className={classes.title}>{message}</h2>}
        {messageDetail && <div className={classes.detail}>{messageDetail}</div>}
      </CardContent>
    </Card>
  );
};

export default Message;
