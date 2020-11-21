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
import QuestionDetail from './pages/QuestionDetail';

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
          <Redirect from="/" to="/login" />
        </Switch>
      ) : (
        <MainWrapper>
          <QuestionListWidget />
          <FeedWrapper>
            <Switch>
              <Redirect from="/login" to="/friends" />
              <Redirect from="/signup" to="/select-questions" />
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
                path="/questions/:id"
                component={QuestionDetail}
              />
              <Redirect from="/" to="/friends" />
            </Switch>
          </FeedWrapper>
          <FriendListWidget />
        </MainWrapper>
      )}
    </MuiThemeProvider>
  );
};

export default App;
