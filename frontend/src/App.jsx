import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles';
import StyledComponentExample from './components/StyledComponentExample';
import HooksTutorial from './pages/HooksTutorial';

function App() {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route path="/style-example" component={StyledComponentExample} />
        <Route path="/hooks" component={HooksTutorial} />
      </Switch>
    </>
  );
}

export default App;
