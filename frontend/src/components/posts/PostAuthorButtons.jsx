import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import {
  IconButton,
  Card,
  Grow,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(() => ({
  card: {
    position: 'absolute',
    right: '12px'
  }
}));

const PostAuthorWrapper = styled.div`
  justify-self: right;
`;

export default function PostAuthorButtons({ onClickEdit, onClickDelete }) {
  const classes = useStyles();
  const [showButtons, setShowButtons] = useState(false);
  return (
    <PostAuthorWrapper>
      <IconButton
        aria-label="delete"
        color="secondary"
        id="more-button"
        style={{ padding: '4px' }}
        onClick={() => setShowButtons((prev) => !prev)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Grow in={showButtons}>
        <Card className={classes.card}>
          <List style={{ padding: '0' }}>
            <ListItem button>
              <ListItemText primary="수정하기" onClick={onClickEdit} />
            </ListItem>
            <ListItem button>
              <ListItemText primary="삭제하기" onClick={onClickDelete} />
            </ListItem>
          </List>
        </Card>
      </Grow>
    </PostAuthorWrapper>
  );
}

PostAuthorWrapper.displayName = 'PostAuthorWrapper';
