import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles';
import StyledComponentExample from './components/StyledComponentExample';
import Login from './pages/Login';
import NewPost from './components/NewPost';

function App() {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route exact path="/new-post" component={NewPost} />
        <Route exact path="/login" component={Login} />
        <Route path="/style-example" component={StyledComponentExample} />
      </Switch>
    </>
  );
}

export default App;
