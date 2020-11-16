import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';

const ListItemLink = (props) => {
  const { to } = props;
  if (to === undefined) return <ListItem button {...props} />;
  return <ListItem button component={Link} {...props} />;
};

export default ListItemLink;
