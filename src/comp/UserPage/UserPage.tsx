import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { Avatar } from 'antd';
import { connect, ConnectedProps } from 'react-redux';
import MyLayout from '../Layout/MyLayout';
import { db, storage } from '../../fbconfig';
import { USER_COLLECTION_NAME } from '../../bll/reducers/userReducer';
import { User } from '../../types/types';
import { RootState } from '../../store';

type Props = {
    username: string
}
const UserPage = ({ match, name }: RouteComponentProps<Props> & ConnectedProps<typeof connector>) => {
  const { username } = match.params;
  const [user, setUser] = useState<User>();
  const [img, setImg] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  useEffect(() => {
    setLoading(true);
    db.collection(USER_COLLECTION_NAME).where('username', '==', username).get().then((querry) => {
      if (querry.size) {
        querry.forEach((data) => {
          setUser(data.data() as User);
          storage.ref(data.data().photo_url as string).getDownloadURL().then((url) => {
            setImg(url);
          });
        });
      } else {
        history.push('/');
      }
    })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (name === username) return (<Redirect to="/" />);
  const avatar = (img ? <Avatar src={img} size={64} /> : <Avatar size={64} gap={2}>{username.toString().charAt(0)}</Avatar>);
  if (loading) return (<MyLayout title="Home">Loading</MyLayout>);
  return (
    <MyLayout title="Home">
      <h2>{username}</h2>
      {avatar}
    </MyLayout>
  );
};

const mapStateToProps = (state: RootState) => ({
  name: state.users.user.username,
});

const connector = connect(mapStateToProps);

export default withRouter(connector(UserPage));
