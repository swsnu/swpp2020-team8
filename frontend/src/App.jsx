import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles';
import StyledComponentExample from './components/StyledComponentExample';

import Login from './pages/Login';
import FriendFeed from './pages/FriendFeed';
import LogoutButton from './components/LogoutButton';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/friends">
          <LogoutButton />
          <FriendFeed />
        </Route>
        <Route path="/style-example" component={StyledComponentExample} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
