import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import NotificationItem from '../components/NotificationItem';
import FriendItem from '../components/friends/FriendItem';

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
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  header: {
    backgroundColor: 'white',
    boxShadow:
      '0 5px 10px rgba(154, 160, 185, 0.05), 0 5px 10px rgba(166, 173, 201, 0.2)'
  },
  tabPanel: {
    marginTop: theme.spacing(3)
  }
}));

export default function NotificationPage() {
  const classes = useStyles();
  const [tab, setTab] = React.useState(0);
  const notifications = useSelector(
    (state) => state.notiReducer.receivedNotifications
  );

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const notificationList = notifications.map((noti) => (
    <NotificationItem
      key={`noti-${noti?.id}`}
      notiObj={noti}
      isNotificationPage
    />
  ));

  const friendRequestList = notifications
    .filter((noti) => noti.target_type === 'FriendRequest')
    .map((friendRequest) => (
      <FriendItem
        key={`friend-request-${friendRequest?.id}`}
        friendObj={friendRequest.actor_detail}
        isFriend={false}
      />
    ));

  const responseRequestList = notifications
    .filter((noti) => noti.target_type === 'ResponseRequest')
    .map((responseRequest) => (
      <NotificationItem
        key={`response-request-${responseRequest?.id}`}
        notiObj={responseRequest}
        isNotificationPage
      />
    ));

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="notification-tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="전체" {...a11yProps(0)} />
          <Tab label="친구 요청" {...a11yProps(1)} />
          <Tab label="받은 질문" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0} className={classes.tabPanel}>
        {notificationList}
      </TabPanel>
      <TabPanel value={tab} index={1} className={classes.tabPanel}>
        {friendRequestList}
      </TabPanel>
      <TabPanel value={tab} index={2} className={classes.tabPanel}>
        {responseRequestList}
      </TabPanel>
    </div>
  );
}
