import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useParams } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import UserPostList from '../components/posts/UserPostList';
import { getSelectedUserPosts, appendPosts } from '../modules/post';
import { getSelectedUser } from '../modules/user';
import { getFriendList } from '../modules/friend';
import FriendStatusButtons from '../components/friends/FriendStatusButtons';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`
  };
}

const MobileTabPanel = styled(TabPanel)`
  @media (max-width: 650px) {
    padding: 0 !important;

    .MuiBox-root-20 {
      padding: 0 !important;
    }
  }
`;

const UserPageWrapper = styled.div`
  background: #ffffff;
  height: 120px;
  text-align: center;
  padding-top: 50px;
  margin-bottom: 20px;
`;

const MobileWrapper = styled.div`
  @media (max-width: 650px) {
    border: none !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #e7e7e7',
    borderRadius: '4px'
  },
  header: {
    backgroundColor: 'white',
    boxShadow:
      '0 5px 10px rgba(154, 160, 185, 0.05), 0 5px 10px rgba(166, 173, 201, 0.2)'
  }
}));

export default function UserPage() {
  const [target, setTarget] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedUser = useSelector((state) => state.userReducer.selectedUser);
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const friendList = useSelector((state) => state.friendReducer.friendList);
  const friendIdList = friendList.map((friend) => friend.id);
  const isFriendOrMyPage =
    selectedUser &&
    (friendIdList.includes(selectedUser?.id) ||
      selectedUser?.id === currentUser?.id);

  const [value, setValue] = useState('All');
  const selectedUserPosts = useSelector(
    (state) => state.postReducer.selectedUserPosts
  );

  const isAppending = useSelector(
    (state) => state.loadingReducer['post/APPEND_POSTS']
  );
  const isLoading = useSelector(
    (state) => state.loadingReducer['post/GET_USER_POSTS']
  );

  useEffect(() => {
    dispatch(getSelectedUser(id));
    dispatch(getFriendList());
    dispatch(getSelectedUserPosts(id));
    setValue('All');
  }, [dispatch, id]);

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, { threshold: 1 });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      dispatch(appendPosts('selectedUser'));
    }
  };

  const userResponses = selectedUserPosts?.filter(
    (post) => post.type === 'Response'
  );

  const userArticles = selectedUserPosts?.filter(
    (post) => post.type === 'Article'
  );

  const userQuestions = selectedUserPosts?.filter(
    (post) => post.type === 'Question'
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MobileWrapper className={classes.root}>
      <Container fixed>
        <UserPageWrapper>
          <FaceIcon
            style={{
              color: selectedUser?.profile_pic
            }}
          />
          <h3 margin-bottom="10px">{selectedUser?.username}</h3>
          <div>
            {selectedUser && (
              <FriendStatusButtons
                isUserPage
                friendObj={selectedUser}
                isFriend={selectedUser.are_friends}
                isPending={selectedUser.received_friend_request_from}
                hasSentRequest={selectedUser.sent_friend_request_to}
              />
            )}
          </div>
        </UserPageWrapper>
      </Container>
      <AppBar position="static" className={classes.header}>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="user tabs"
        >
          <Tab label="전체" value="All" {...a11yProps('All')} />
          <Tab label="나의 Q&A" value="Q&A" {...a11yProps('Q&A')} />
          <Tab
            label="아무말 대잔치"
            value="Articles"
            {...a11yProps('Articles')}
          />
          <Tab
            label="작성한 질문"
            value="CustomQuestions"
            {...a11yProps('CustomQuestions')}
          />
        </Tabs>
      </AppBar>
      <MobileTabPanel value={value} index="All">
        <UserPostList
          posts={selectedUserPosts}
          isAppending={isAppending}
          isLoading={isLoading}
          isFriendOrMyPage={isFriendOrMyPage}
        />
        <div ref={setTarget} />
      </MobileTabPanel>
      <MobileTabPanel value={value} index="Q&A">
        <UserPostList
          posts={userResponses}
          isAppending={isAppending}
          isLoading={isLoading}
          isFriendOrMyPage={isFriendOrMyPage}
        />
        <div ref={setTarget} />
      </MobileTabPanel>
      <MobileTabPanel value={value} index="Articles">
        <UserPostList
          posts={userArticles}
          isAppending={isAppending}
          isLoading={isLoading}
          isFriendOrMyPage={isFriendOrMyPage}
        />
        <div ref={setTarget} />
      </MobileTabPanel>
      <MobileTabPanel value={value} index="CustomQuestions">
        <UserPostList
          posts={userQuestions}
          isAppending={isAppending}
          isLoading={isLoading}
          isFriendOrMyPage={isFriendOrMyPage}
        />
        <div ref={setTarget} />
      </MobileTabPanel>
    </MobileWrapper>
  );
}
