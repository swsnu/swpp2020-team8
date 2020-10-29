import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles';
import StyledComponentExample from './components/StyledComponentExample';
import SignUp from './pages/SignUp';
import QuestionSelection from './pages/QuestionSelection';

function App() {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/signup/questions" component={QuestionSelection} />
        <Route path="/style-example" component={StyledComponentExample} />
      </Switch>
    </>
  );
}

export default App;
