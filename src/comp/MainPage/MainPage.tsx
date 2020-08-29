import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import MyLayout from '../Layout/MyLayout';
import { RootState } from '../../store';
import FullScreenPreloader from '../FullScreenPreloader/FullScreenPreloader';

const MainPage = ({ isLogged, isFetching, user }: ConnectedProps<typeof connector>) => {
  if (!isLogged) return (<Redirect to="/signIn" />);
  if (isFetching) return (<FullScreenPreloader />);
  return (
    <MyLayout title="Home">
      <h2>{user.username}</h2>
    </MyLayout>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.users.user,
  isLogged: state.users.isLogged,
  isFetching: state.users.isFetching,
});

const connector = connect(mapStateToProps);

export default connector(MainPage);
