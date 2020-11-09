import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import GlobalStyle, { MainWrapper, FeedWrapper } from './styles';
import StyledComponentExample from './components/StyledComponentExample';
import Header from './components/Header';
import QuestionListWidget from './components/QuestionListWidget';
import FriendListWidget from './components/FriendListWidget';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import QuestionSelection from './pages/QuestionSelection';
import FriendFeed from './pages/FriendFeed';
import AnonymousFeed from './pages/AnonymousFeed';
import QuestionFeed from './pages/QuestionFeed';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  // TODO: signedIn redux state
  const [signedIn] = useState(true);

  return (
    <>
      <GlobalStyle />
      <Header signedIn={signedIn} />
      {!signedIn ? (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/select-questions" component={QuestionSelection} />
          <Route path="/style-example" component={StyledComponentExample} />
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
    </>
  );
};

export default App;
