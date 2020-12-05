import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { primaryColor, borderColor } from '../constants/colors';
import NotificationDropdownList from './NotificationDropdownList';
import SearchDropdownList from './SearchDropdownList';
import { logout } from '../modules/user';
import { getNotifications } from '../modules/notification';
import { fetchSearchResults } from '../modules/search';
import MobileDrawer from './posts/MobileDrawer';

const HelloUsername = styled.div`
  font-size: 14px;
  margin-bottom: 7px;
  margin-left: 3px;
  color: #777;
  margin-right: 24px;
`;
const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none'
  },
  right: {
    position: 'absolute',
    right: '16px'
  },
  grow: {
    flexGrow: 1
  },
  header: {
    width: '100vw',
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 12px',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0
  },
  logo: {
    width: '130px',
    height: '60px',
    background: 'url("/full-logo.svg") no-repeat',
    backgroundSize: '130px 60px'
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
    color: borderColor,
    '&:hover': {
      color: primaryColor
    },
    marginLeft: theme.spacing(6)
  },
  tabActive: {
    color: primaryColor
  },
  textField: {
    padding: theme.spacing(1, 1, 1, 0),
    width: '21ch',
    color: 'black',
    fontSize: '13px'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  iconButton: {
    marginRight: theme.spacing(1),
    '&:hover': {
      // you want this to be the same as the backgroundColor above
      backgroundColor: 'transparent',
      color: '#000'
    }
  }
}));

// eslint-disable-next-line react/prop-types
const Header = ({ isMobile }) => {
  const classes = useStyles();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const notiRef = useRef(null);
  const notiIconRef = useRef(null);

  const searchRef = useRef(null);

  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const totalPages = useSelector(
    (state) => state.searchReducer.searchObj?.totalPages
  );

  const notifications = useSelector(
    (state) => state.notiReducer.receivedNotifications
  );

  const unreadNotifications = notifications?.filter((noti) => !noti.is_read);
  const notiBadgeInvisible = unreadNotifications?.length === 0;

  useEffect(() => {
    if (currentUser) {
      dispatch(getNotifications());
    }
  }, [dispatch, currentUser]);

  const handleNotiClose = () => {
    setIsNotiOpen(false);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  useOnClickOutside([notiRef, notiIconRef], handleNotiClose);
  useOnClickOutside(searchRef, handleSearchClose);

  const handleClickLogout = () => {
    dispatch(logout());
  };

  const toggleNotiOpen = () => {
    setIsNotiOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchSearchResults(1, ''));
    // reset search results when mounted
  }, [dispatch]);

  useEffect(() => {
    if (query.length) {
      dispatch(fetchSearchResults(1, query));
    } else setIsSearchOpen(false);
  }, [query]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      window.location.pathname !== '/user-search' &&
      window.location.pathname !== '/search'
    ) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [dispatch, totalPages]);

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const onKeySubmit = (e) => {
    if (e.key === 'Enter' && query !== '') {
      setIsSearchOpen(false);
      history.push(`/search`);
      setQuery('');
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const renderHeaderSignedInItems = isMobile ? (
    <>
      <IconButton
        id="drawer-open-button"
        color="secondary"
        aria-label="open drawer"
        edge="end"
        onClick={() => {
          setIsDrawerOpen(true);
        }}
        style={{ display: isDrawerOpen && 'none' }}
        className={classes.right}
      >
        <MenuIcon />
      </IconButton>
      {isMobile && (
        <MobileDrawer
          open={isDrawerOpen}
          handleDrawerClose={handleDrawerClose}
          onLogout={handleClickLogout}
        />
      )}
    </>
  ) : (
    <>
      <NavLink
        className={classes.tabButton}
        to="/home"
        size="large"
        activeClassName={classes.tabActive}
      >
        Home
      </NavLink>
      <NavLink
        className={classes.tabButton}
        to="/anonymous"
        size="large"
        activeClassName={classes.tabActive}
      >
        익명 글
      </NavLink>
      <NavLink
        className={classes.tabButton}
        to="/questions"
        size="large"
        activeClassName={classes.tabActive}
      >
        질문 모음
      </NavLink>
      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>
        <TextField
          required
          id="input-search-field"
          className={classes.textField}
          InputProps={{
            autoComplete: 'off'
          }}
          size="small"
          value={query}
          label="사용자 검색"
          type="search"
          variant="standard"
          placeholder={query}
          onChange={handleChange}
          onKeyDown={onKeySubmit}
        />
        {/* <HelloUsername>
          {currentUser?.username}
          님, 안녕하세요!
        </HelloUsername> */}
        <IconButton
          ref={notiIconRef}
          aria-label="show new notifications"
          className={`${classes.iconButton} noti-button`}
          onClick={(e) => {
            e.stopPropagation();
            toggleNotiOpen();
          }}
          disableRipple
          color="secondary"
        >
          <Badge variant="dot" invisible={notiBadgeInvisible} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton
          aria-label="account of current user"
          className={classes.iconButton}
          style={{ marginTop: '4px' }}
          disableRipple
          color="secondary"
        >
          <Link to={`/users/${currentUser?.id}`}>
            <AccountCircle color="secondary" />
          </Link>
          <Link to={`/users/${currentUser?.id}`}>
            <HelloUsername>
              {currentUser?.username}
              {/* 님, 안녕하세요! */}
            </HelloUsername>
          </Link>
        </IconButton>

        <Button
          variant="outlined"
          size="medium"
          className={classes.logoutButton}
          style={{
            marginTop: '10px',
            height: '40px'
          }}
          id="logout-button"
          onClick={(e) => {
            e.stopPropagation();
            handleClickLogout();
          }}
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
            <Link to="/" className={classes.logo} />
            {currentUser !== null ? (
              renderHeaderSignedInItems
            ) : (
              <>
                <div className={classes.grow} />
                <Button
                  component={Link}
                  id="login-link"
                  to="/login"
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
      <div ref={notiRef}>
        {isNotiOpen && (
          <NotificationDropdownList
            notifications={notifications}
            setIsNotiOpen={setIsNotiOpen}
          />
        )}
      </div>
      <div ref={searchRef}>{isSearchOpen && <SearchDropdownList />}</div>
    </>
  );
};
export default Header;
