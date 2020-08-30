import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import MyLayout from '../Layout/MyLayout';
import { RootState } from '../../store';
import FullScreenPreloader from '../FullScreenPreloader/FullScreenPreloader';
import { storage } from '../../fbconfig';

const MainPage = ({
  isLogged, isFetching, user, isRegistered,
}: ConnectedProps<typeof connector>) => {
  const AVATAR_REF = storage.ref(`imgs/avatars/${user.id}`);
  const [img, setImg] = useState();
  if (!isLogged) return (<Redirect to="/signIn" />);
  if (isFetching) return (<FullScreenPreloader />);
  if (!isRegistered) return (<Redirect to="/register" />);

  AVATAR_REF.getDownloadURL().then((url: string) => {
    setImg(url);
  });
  return (
    <MyLayout title="Home">
      <h2>{user.username}</h2>
      {img ? <img src={img} alt="Avatar" /> : <></>}
    </MyLayout>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.users.user,
  isLogged: state.users.isLogged,
  isFetching: state.users.isFetching,
  isRegistered: state.users.isRegistered,
});

const connector = connect(mapStateToProps);

export default connector(MainPage);
