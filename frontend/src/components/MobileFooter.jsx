/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    position: 'fixed',
    bottom: 0,
    zIndex: 999,
    background: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 12px'
  },
  icon: {
    minWidth: '20vw'
  }
});

const SmallFontBottomNavAction = styled(BottomNavigationAction)`
  .MuiBottomNavigationAction-label {
    font-size: 0.68rem !important;
  }

  .MuiBottomNavigationAction-label.Mui-selected {
    font-size: 0.7rem !important;
  }
`;

export default function MobileFooter({ notiBadgeInvisible }) {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState('/home');
  const { pathname } = window.location;

  useEffect(() => {
    if (
      [
        '/home',
        '/anonymous',
        '/questions',
        '/notifications',
        '/my-page'
      ].includes(pathname)
    ) {
      setValue(pathname);
    } else {
      setValue(null);
    }
  }, [pathname]);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        history.push(newValue);
        setValue(newValue);
      }}
      id="bottom-nav"
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        value="/home"
        label="Home"
        icon={<HomeIcon />}
        className={`${classes.icon} link`}
      />
      <BottomNavigationAction
        value="/anonymous"
        label="익명피드"
        icon={<SupervisorAccountIcon />}
        className={`${classes.icon} link`}
      />
      <SmallFontBottomNavAction
        value="/questions"
        label="오늘의 질문"
        icon={<LiveHelpIcon />}
        className={`${classes.icon} link`}
        style={{ padding: '6px 4px', fontSize: '0.7rem' }}
      />
      <BottomNavigationAction
        value="/notifications"
        label="알림"
        icon={
          <Badge variant="dot" invisible={notiBadgeInvisible} color="primary">
            <NotificationsIcon />
          </Badge>
        }
        className={`${classes.icon} link`}
      />
      <BottomNavigationAction
        value="/my-page"
        label="MY"
        icon={<AccountCircleIcon />}
        className={`${classes.icon} link`}
      />
    </BottomNavigation>
  );
}
