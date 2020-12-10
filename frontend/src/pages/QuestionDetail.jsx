/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionItem from '../components/posts/QuestionItem';
import {
  getResponsesByQuestionWithType,
  appendResponsesByQuestionWithType,
  resetSelectedQuestion
} from '../modules/question';
import PostItem from '../components/posts/PostItem';
import Message from '../components/Message';
import LoadingList from '../components/posts/LoadingList';

Tabs.displayName = 'Tabs';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  switch: {
    marginRight: theme.spacing(1)
  },
  switchLabel: {
    marginTop: '-4px'
  },
  header: {
    backgroundColor: 'white',
    boxShadow:
      '0 5px 10px rgba(154, 160, 185, 0.05), 0 5px 10px rgba(166, 173, 201, 0.2)'
  },
  tabPanel: {
    marginTop: theme.spacing(1)
  }
}));

const QuestionDetail = (props) => {
  const classes = useStyles();

  const { match } = props;
  const questionId = match.params.id;

  const [tab, setTab] = React.useState(0);
  const [tabName, setTabName] = React.useState('all');
  const [target, setTarget] = useState(null);

  const dispatch = useDispatch();
  const question = useSelector(
    (state) => state.questionReducer.selectedQuestion
  );

  const isLoading =
    useSelector(
      (state) =>
        state.loadingReducer['question/GET_SELECTED_QUESTION_ALL_RESPONSES']
    ) === 'REQUEST';

  const friendTabisLoading =
    useSelector(
      (state) =>
        state.loadingReducer['question/GET_SELECTED_QUESTION_FRIEND_RESPONSES']
    ) === 'REQUEST';

  const anonymousTabisLoading =
    useSelector(
      (state) =>
        state.loadingReducer[
          'question/GET_SELECTED_QUESTION_ANONYMOUS_RESPONSES'
        ]
    ) === 'REQUEST';

  const isAppending =
    useSelector(
      (state) =>
        state.loadingReducer['question/APPEND_SELECTED_QUESTION_RESPONSES']
    ) === 'REQUEST';

  const responses = useSelector(
    (state) => state.questionReducer.selectedQuestionResponses
  );

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    if (newValue === 0) setTabName('all');
    if (newValue === 1) setTabName('friend');
    if (newValue === 2) setTabName('anonymous');
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      dispatch(appendResponsesByQuestionWithType(questionId, tabName));
    }
  };

  useEffect(() => {
    dispatch(getResponsesByQuestionWithType(questionId, tabName));
  }, [dispatch, questionId, tab]);

  const resetTabs = () => {
    setTab(0);
    setTabName('all');
  };
  useEffect(() => {
    return () => {
      resetTabs();
      dispatch(resetSelectedQuestion());
    };
  }, [questionId]);

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, { threshold: 1 });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  const responseList = (
    <>
      {responses.map((post) => (
        <PostItem
          postKey={`${post.type}-${post.id}`}
          key={`${post.type}-${post.id}`}
          postObj={post}
          resetAfterComment={resetTabs}
        />
      ))}
      <div ref={setTarget} />
      <div style={{ margin: '8px', textAlign: 'center' }}>
        {isAppending && <CircularProgress id="spinner" color="primary" />}
      </div>
    </>
  );

  return (
    <div>
      {isLoading ? (
        <LoadingList />
      ) : question ? (
        <>
          <QuestionItem
            questionObj={question}
            questionId={questionId}
            onResetContent={() => resetTabs()}
          />
          <AppBar position="static" className={classes.header}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="notification-tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="전체" {...a11yProps(0)} />
              <Tab label="친구" {...a11yProps(1)} />
              <Tab label="익명" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          {responses?.length !== 0 ? (
            <>
              <TabPanel value={tab} index={0} className={classes.tabPanel}>
                {isLoading ? <LoadingList /> : responseList}
              </TabPanel>
              <TabPanel value={tab} index={1} className={classes.tabPanel}>
                {friendTabisLoading ? <LoadingList /> : responseList}
              </TabPanel>
              <TabPanel value={tab} index={2} className={classes.tabPanel}>
                {anonymousTabisLoading ? <LoadingList /> : responseList}
              </TabPanel>
            </>
          ) : (
            <Message margin="16px 0" message="표시할 게시물이 없습니다 :(" />
          )}
        </>
      ) : (
        <Message message="존재하지 않는 질문입니다" />
      )}
    </div>
  );
};

export default withRouter(QuestionDetail);
