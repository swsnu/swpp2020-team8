import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
  // TODO: signedIn redux state
  const [signedIn] = useState(true);

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyle />
      <Header signedIn={signedIn} />
      {!signedIn ? (
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
              <PrivateRoute
                exact
                path="/friends"
                component={FriendFeed}
                signedIn
              />
              <PrivateRoute
                exact
                path="/anonymous"
                component={AnonymousFeed}
                signedIn
              />
              <PrivateRoute
                exact
                path="/questions"
                component={QuestionFeed}
                signedIn
              />
              <Redirect path="/" to="/friends" />
            </Switch>
          </FeedWrapper>
          <FriendListWidget />
        </MainWrapper>
      )}
    </MuiThemeProvider>
  );
};

export default App;
