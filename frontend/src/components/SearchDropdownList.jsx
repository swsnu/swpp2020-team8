import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import FriendItem from './friends/FriendItem';

const SearchCard = styled(Card)`
  @media (min-width: 650px) {
    width: 300px;
    max-height: 85%;
    position: fixed;
    top: 68px;
    right: 230px;
    z-index: 120;
  }

  box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 12px;
`;

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
    <FriendItem key={user.id} friendObj={user} isWidget />
  ));

  return (
    <SearchCard variant="outlined">
      <CardContent className={classes.searchDropdownContent}>
        {userList}
      </CardContent>
    </SearchCard>
  );
};

export default SearchDropdownList;
