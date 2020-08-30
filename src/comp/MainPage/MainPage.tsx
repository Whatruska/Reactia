import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { Avatar } from 'antd';
import MyLayout from '../Layout/MyLayout';
import { RootState } from '../../store';
import FullScreenPreloader from '../FullScreenPreloader/FullScreenPreloader';
import { storage } from '../../fbconfig';

const MainPage = ({
  isLogged, isFetching, user, isRegistered,
}: ConnectedProps<typeof connector>) => {
  const [img, setImg] = useState();

  if (!isLogged) return (<Redirect to="/signIn" />);
  if (isFetching) return (<FullScreenPreloader />);
  if (!isRegistered) return (<Redirect to="/register" />);

  const AVATAR_REF = storage.ref(user.photo_url);

  AVATAR_REF.getDownloadURL().then((url: string) => {
    setImg(url);
  });
  const avatar = (img ? <Avatar src={img} size={64} /> : <Avatar size={64} gap={2}>{user.username.toString().charAt(0)}</Avatar>);
  return (
    <MyLayout title="Home">
      <h2>{user.username}</h2>
      {avatar}
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
