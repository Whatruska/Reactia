import {
  Button, Col, Layout, Row, Typography, Menu,
} from 'antd';
import React, { ReactNode } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import firebase from 'firebase';
import { HomeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import classes from './MyLayout.module.css';

const { Header, Footer } = Layout;
const { Title, Text } = Typography;

type WithChildren = {
    children: ReactNode
}
const MyLayout = ({ children }:WithChildren) => {
  const history = useHistory();
  const logout = () => {
    firebase.auth().signOut().then(() => {
      window.localStorage.removeItem('user');
      history.push('/signIn');
    });
  };
  return (
    <Layout>
      <Header>
        <Row align="middle" justify="space-between" gutter={16}>
          <Col span={4}>
            <Title level={3} style={{ marginBottom: '0px' }}>
              <Text style={{ color: 'white' }}>
                Reactia
              </Text>
            </Title>
          </Col>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <NavLink to="/" exact activeClassName={classes.activeLink}>
                Home
              </NavLink>
            </Menu.Item>
            <Menu.Item key="posts" icon={<MessageOutlined />}>
              <NavLink to="/posts" activeClassName={classes.activeLink}>
                Posts
              </NavLink>
            </Menu.Item>
            <Menu.Item key="friends" icon={<UserOutlined />}>
              <NavLink to="/friends" activeClassName={classes.activeLink}>
                Friends
              </NavLink>
            </Menu.Item>
          </Menu>
          <Col span={4} offset={2}>
            <Button type="primary" onClick={logout} danger>Logout</Button>
          </Col>
        </Row>
      </Header>
      {children}
      <Footer>
        Footer
      </Footer>
    </Layout>
  );
};

export default MyLayout;
