import React, { useEffect, useRef, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import TextField from '@material-ui/core/TextField';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useOnClickOutside from 'use-onclickoutside';
import { primaryColor, borderColor } from '../constants/colors';
import NotificationDropdownList from './NotificationDropdownList';
import SearchDropdownList from './SearchDropdownList';
import { logout } from '../modules/user';
import { fetchSearchResults } from '../modules/search';

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
    marginRight: theme.spacing(1)
  }
}));

// eslint-disable-next-line react/prop-types
const Header = () => {
  const classes = useStyles();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const notiRef = useRef(null);
  const searchRef = useRef(null);

  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const totalPages = useSelector(
    (state) => state.searchReducer.searchObj.totalPages
  );

  const handleNotiClose = () => {
    setIsNotiOpen(false);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  useOnClickOutside(notiRef, handleNotiClose);
  useOnClickOutside(searchRef, handleSearchClose);

  const handleClickLogout = () => {
    dispatch(logout());
  };

  const toggleNotiOpen = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  useEffect(() => {
    if (totalPages > 0 && window.location.pathname !== '/search') {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
    dispatch(fetchSearchResults(1, query));
  }, [dispatch, query, totalPages]);

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const onKeySubmit = (e) => {
    if (e.key === 'Enter' && query !== '') {
      setIsSearchOpen(false);
      history.push(`/search`);
    }
  };

  const renderHeaderSignedInItems = (
    <>
      <NavLink
        className={classes.tabButton}
        to="/friends"
        size="large"
        activeClassName={classes.tabActive}
      >
        친구들의 글
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
          size="small"
          value={query}
          label="사용자 검색"
          type="search"
          variant="standard"
          placeholder={query}
          onChange={handleChange}
          onKeyDown={onKeySubmit}
        />
        <IconButton
          aria-label="show new notifications"
          className={`${classes.iconButton} noti-button`}
          onClick={(e) => {
            e.stopPropagation();
            toggleNotiOpen();
          }}
        >
          <Badge badgeContent={3} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          aria-label="account of current user"
          className={classes.iconButton}
        >
          <Link to={`/users/${currentUser?.id}/`}>
            <AccountCircle />
          </Link>
        </IconButton>
        <Button
          variant="outlined"
          size="medium"
          className={classes.logoutButton}
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
            <Link to="/friends" className={classes.logo} />
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
      <div ref={notiRef}>{isNotiOpen && <NotificationDropdownList />}</div>
      <div ref={searchRef}>{isSearchOpen && <SearchDropdownList />}</div>
    </>
  );
};
export default Header;
