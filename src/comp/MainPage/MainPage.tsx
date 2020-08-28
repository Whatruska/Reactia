import React from 'react';
import { Redirect } from 'react-router-dom';
import MyLayout from '../Layout/MyLayout';

const MainPage = () => {
  if (!window.localStorage.getItem('user')) return (<Redirect to="/signIn" />);
  return (
    <MyLayout title="Home">
      <h2>Main page</h2>
    </MyLayout>
  );
};

export default MainPage;
