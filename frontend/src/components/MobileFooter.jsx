import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router';

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
    minWidth: '40px'
  }
});

export default function MobileFooter() {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState('/');
  const { pathname } = window.location;

  useEffect(() => {
    if (
      ['/', '/anonymous', 'questions', '/notifications', 'my-page'].includes(
        pathname
      )
    ) {
      setValue(pathname);
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
        value="/"
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
      <BottomNavigationAction
        value="/questions"
        label="질문모음"
        icon={<LiveHelpIcon />}
        className={`${classes.icon} link`}
      />
      <BottomNavigationAction
        value="/notifications"
        label="알림"
        icon={<NotificationsIcon />}
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
