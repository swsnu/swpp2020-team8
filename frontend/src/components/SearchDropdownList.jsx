import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import FriendItem from './FriendItem';

const useStyles = makeStyles({
  searchDropdown: {
    width: 300,
    maxHeight: '85%',
    position: 'fixed',
    top: 68,
    right: 230,
    zIndex: 1
  },
  searchDropdownContent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: '0 !important'
    }
  }
});

const SearchDropdownList = () => {
  const classes = useStyles();
  const results = useSelector((state) => state.searchReducer.searchObj.results);

  const userList = results?.map((user) => (
    <FriendItem key={user.id} friendObj={user} message={user.username} />
  ));

  return (
    <Card variant="outlined" className={classes.searchDropdown}>
      <CardContent className={classes.searchDropdownContent}>
        {userList}
      </CardContent>
    </Card>
  );
};

export default SearchDropdownList;
