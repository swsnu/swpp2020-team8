import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useSelector } from 'react-redux';
import Login from './pages/Login';
import { GlobalStyle, MainWrapper, FeedWrapper } from './styles';
import Header from './components/Header';
import QuestionListWidget from './components/QuestionListWidget';
import FriendListWidget from './components/FriendListWidget';
import SignUp from './pages/SignUp';
import QuestionSelection from './pages/QuestionSelection';
import FriendFeed from './pages/FriendFeed';
import AnonymousFeed from './pages/AnonymousFeed';
import QuestionFeed from './pages/QuestionFeed';
import PrivateRoute from './components/PrivateRoute';
import PostDetail from './pages/PostDetail';
import FriendsPage from './pages/FriendsPage';
import NotificationPage from './pages/NotificationPage';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#ff395b' },
    secondary: { light: '#eee', main: '#777' }
  },
  typography: {
    fontFamily: ['Noto Sans KR', 'sans-serif']
  }
});

const App = () => {
  const user = useSelector((state) => state.userReducer.user);
  const signUpRedirectPath = user?.question_history
    ? '/friends'
    : 'select-questions';
  // let signedIn = user !== null;

  // useEffect(() => {
  //   if (user == null) signedIn = false;
  //   else signedIn = true;
  // }, [user]);

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      {user == null ? (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/select-questions" component={QuestionSelection} />
          <Redirect path="/" to="/login" />
        </Switch>
      ) : (
        <MainWrapper>
          <QuestionListWidget />
          <FeedWrapper>
            <Switch>
              <Redirect from="/login" to="/friends" />
              <Redirect from="/signup" to={signUpRedirectPath} />
              <Route
                exact
                path="/select-questions"
                component={QuestionSelection}
              />
              <PrivateRoute exact path="/friends" component={FriendFeed} />
              <PrivateRoute exact path="/anonymous" component={AnonymousFeed} />
              <PrivateRoute exact path="/questions" component={QuestionFeed} />
              <PrivateRoute
                exact
                path="/:postType/:id"
                component={PostDetail}
              />
              <PrivateRoute
                exact
                path="/users/:id/friends"
                component={FriendsPage}
              />
              <PrivateRoute
                exact
                path="/notifications"
                component={NotificationPage}
              />
              <Redirect exact path="/" to="/friends" />
            </Switch>
          </FeedWrapper>
          <FriendListWidget />
        </MainWrapper>
      )}
    </MuiThemeProvider>
  );
};

export default App;
