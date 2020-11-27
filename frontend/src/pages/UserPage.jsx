import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import UserPostList from '../components/posts/UserPostList';
import { getSelectedUserPosts } from '../modules/post';

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

const UserPageWrapper = styled.div`
  background: #ffffff;
  height: 200px;
  text-align: center;
`;

export default function UserPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const [value, setValue] = React.useState('All');

  const selectedUserPosts = useSelector(
    (state) => state.postReducer.selectedUserPosts
  );

  useEffect(() => {
    dispatch(getSelectedUserPosts(user.id));
  }, [dispatch]);

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
    <Paper square>
      <Container fixed>
        <UserPageWrapper>
          <FaceIcon />
          <h3>{user.username}</h3>
        </UserPageWrapper>
      </Container>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
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
      <TabPanel value={value} index="All">
        <UserPostList posts={selectedUserPosts} />
      </TabPanel>
      <TabPanel value={value} index="Q&A">
        <UserPostList posts={userResponses} />
      </TabPanel>
      <TabPanel value={value} index="Articles">
        <UserPostList posts={userArticles} />
      </TabPanel>
      <TabPanel value={value} index="CustomQuestions">
        <UserPostList posts={userQuestions} />
      </TabPanel>
    </Paper>
  );
}
