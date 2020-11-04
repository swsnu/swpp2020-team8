import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles';
import StyledComponentExample from './components/StyledComponentExample';
import Login from './pages/Login';

function App() {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/style-example" component={StyledComponentExample} />
      </Switch>
    </>
  );
}

export default App;
