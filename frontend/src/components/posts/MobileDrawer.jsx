import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import styled from 'styled-components';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SearchIcon from '@material-ui/icons/Search';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router';

const MarginListItem = styled(ListItem)`
  margin: 16px;
`;

MarginListItem.displayName = 'ListItem';

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
`;
const drawerWidth = '60%';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1)
  }
}));

export default function MobileDrawer({ open, handleDrawerClose, onLogout }) {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div id="drawer-wrapper">
      {open && (
        <Mask id="mask" className={classes.mask} onClick={handleDrawerClose} />
      )}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton
            style={{ width: '40vw', paddingLeft: '30vw' }}
            onClick={handleDrawerClose}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MarginListItem button>
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText
              primary="친구"
              onClick={() => {
                history.push('/my-friends');
                handleDrawerClose();
              }}
            />
          </MarginListItem>
          <MarginListItem button>
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText
              primary="추천 질문"
              onClick={() => {
                history.push('/recommended-questions');
                handleDrawerClose();
              }}
            />
          </MarginListItem>
          <MarginListItem button>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText
              primary="사용자 검색"
              onClick={() => {
                history.push('/user-search');
                handleDrawerClose();
              }}
            />
          </MarginListItem>
          <MarginListItem
            button
            onClick={() => {
              onLogout();
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
          </MarginListItem>
        </List>
      </Drawer>
    </div>
  );
}
