import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import SignIn from './comp/SignIn/SignIn';
import MainPage from './comp/MainPage/MainPage';
import Posts from './comp/Posts/Posts';
import Friends from './comp/Friends/Friends';
import store from "./store";
import Register from "./comp/Register/Register";
import UserPage from "./comp/UserPage/UserPage";

type Doc = {
  title: string,
  desc: string,
  id: string
}
function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Switch>
          <Route path="/signIn">
            <SignIn />
          </Route>
          <Route path="/posts" exact>
            <Posts />
          </Route>
          <Route path="/friends" exact>
            <Friends />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/user/:username" exact>
            <UserPage />
          </Route>
          <Route>
            <MainPage />
          </Route>
        </Switch>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
