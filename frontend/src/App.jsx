import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles';
import StyledComponentExample from './components/StyledComponentExample';

function App() {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route path="/style-example" component={StyledComponentExample} />
      </Switch>
    </>
  );
}

export default App;
