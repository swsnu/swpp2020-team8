import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';

const ListItemLink = (props) => {
  return <ListItem button component={Link} {...props} />;
};

export default ListItemLink;
