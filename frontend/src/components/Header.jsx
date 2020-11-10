import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import { primaryColor, borderColor } from '../constants/colors';
import NotificationDropdownList from './NotificationDropdownList';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  header: {
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 12px',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    },
    color: 'black',
    fontSize: '28px',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'false'
    }
  },
  tabButton: {
    fontSize: '16px',
    '&:hover': {
      color: primaryColor
    },
    marginLeft: theme.spacing(6)
  },
  search: {
    position: 'relative',
    borderColor,
    border: '1px solid',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    },
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '80%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: borderColor
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    },
    color: 'black',
    fontSize: '14px'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  iconButton: {
    marginRight: theme.spacing(1)
  }
}));

// eslint-disable-next-line react/prop-types
const Header = ({ signedIn }) => {
  const classes = useStyles();
  const { pathname } = window.location;

  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const toggleNotiOpen = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  const renderHeaderSignedInItems = (
    <>
      <Button
        className={classes.tabButton}
        href="/friends"
        size="large"
        style={{
          color: pathname === '/friends' ? primaryColor : borderColor
        }}
      >
        친구들의 글
      </Button>
      <Button
        className={classes.tabButton}
        href="/anonymous"
        size="large"
        style={{
          color: pathname === '/anonymous' ? primaryColor : borderColor
        }}
      >
        익명 글
      </Button>
      <Button
        className={classes.tabButton}
        href="/questions"
        size="large"
        style={{
          color: pathname === '/questions' ? primaryColor : borderColor
        }}
      >
        질문 모음
      </Button>
      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="사용자 검색"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
        <IconButton
          aria-label="show new notifications"
          className={`${classes.iconButton} noti-button`}
          onClick={(e) => {
            e.stopPropagation();
            toggleNotiOpen();
          }}
        >
          <Badge badgeContent={3} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          href=""
          aria-label="account of current user"
          className={classes.iconButton}
        >
          <AccountCircle />
        </IconButton>
        <Button
          variant="outlined"
          size="medium"
          className={classes.logoutButton}
        >
          로그아웃
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div className={classes.grow}>
        <AppBar position="static" className={classes.header}>
          <Toolbar>
            <Link href="/friends" component="button" className={classes.title}>
              adoor
            </Link>
            {signedIn ? (
              renderHeaderSignedInItems
            ) : (
              <>
                <div className={classes.grow} />
                <Button
                  component="a"
                  href="/login"
                  variant="outlined"
                  size="medium"
                  className={classes.logoutButton}
                >
                  로그인
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
      {isNotiOpen && <NotificationDropdownList />}
    </>
  );
};

export default Header;
