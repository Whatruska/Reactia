import {
  Button, Col, Layout, Row, Menu,
} from 'antd';
import React, { ReactNode } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { HomeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import classes from './MyLayout.module.css';
import logo from '../../assets/img/Reactia_logo.png';
import {RootState} from "../../store";
import { logoutThunk} from "../../bll/reducers/userReducer";
import {connect, ConnectedProps} from "react-redux";

const { Header, Footer } = Layout;

type Props = {
    children: ReactNode,
    title: string
}
const MyLayout = ({ children, title, logout }: ConnectedProps<typeof connector> & Props) => {
  const history = useHistory();
  const handleLogout = () => {
    logout();
    history.push('/signIn');
  };
  return (
    <Layout>
      <Header>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`Reactia | ${title.charAt(0).toUpperCase() + title.substr(1)}`}</title>
        </Helmet>
        <Row align="middle" justify="space-between" gutter={16}>
          <Col span={4} style={{ height: '7vh', position: 'relative' }}>
            <img src={logo} alt="Reactia logo" className={classes.logo} />
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
            <Button type="primary" onClick={handleLogout} danger>Logout</Button>
          </Col>
        </Row>
      </Header>
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>
      <Footer style={{ minHeight: '11vh' }}>
        &copy; Reactia, 2020, All rights reserved.
      </Footer>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => {
    dispatch(logoutThunk());
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(MyLayout);
