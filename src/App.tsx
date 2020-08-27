import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './comp/SignIn/SignIn';
import MainPage from './comp/MainPage/MainPage';

type Doc = {
  title: string,
  desc: string,
  id: string
}
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signIn">
          <SignIn />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
