import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './comp/SignIn';

type Doc = {
  title: string,
  desc: string,
  id: string
}
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <SignIn />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
