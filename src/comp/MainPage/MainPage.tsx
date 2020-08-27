import React from 'react';
import firebase from 'firebase';
import { Redirect, useHistory } from 'react-router-dom';

const MainPage = () => {
  const history = useHistory();
  const logout = () => {
    firebase.auth().signOut().then(() => {
      window.localStorage.removeItem('user');
      history.push('/signIn');
    });
  };
  if (!window.localStorage.getItem('user')) return (<Redirect to="/signIn" />);
  return (
    <div>
      <h2>Main page</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default MainPage;
