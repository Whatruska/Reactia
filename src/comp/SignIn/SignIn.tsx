import React, { SyntheticEvent, useState } from 'react';
import firebase from 'firebase';
import { Redirect, useHistory } from 'react-router-dom';
import {
  Button, Input, Typography, Form, message,
} from 'antd';
import {
  PhoneOutlined, LockOutlined, LoginOutlined, SendOutlined, Loading3QuartersOutlined,
} from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import logo from '../../assets/img/Reactia_logo.png';
import classes from './SignIn.module.css';
import { RootState } from '../../store';
import { loginThunk } from '../../bll/reducers/userReducer';
import { User } from '../../types/types';
import FullScreenPreloader from "../FullScreenPreloader/FullScreenPreloader";

const { Title } = Typography;

const SignIn = ({ isLogged, login, isFetching }: ConnectedProps<typeof connector>) => {
  const [confirmRes, setConfirmRes] = useState();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha-container', {
    size: 'invisible',
  });
  const history = useHistory();
  const signIn = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!confirmRes) {
      firebase.auth().signInWithPhoneNumber(phone, recaptchaVerifier)
        .then((confirmationResult) => {
          setConfirmRes(confirmationResult);
          message.success('Code successfully sent. Check your phone', 2);
        }).catch((error) => {
          message.error(error.message, 2);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      confirmRes.confirm(code).then((result:any) => {
        const newUser = result.user;
        login({
          ...newUser,
          id: newUser.uid,
        });
        recaptchaVerifier.clear();
        history.push('/');
      }).catch((error:any) => {
        message.error((error), 2);
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  if (isLogged) return (<Redirect to="/" />);
  const layout = {
    wrapperCol: { span: 60 },
  };
  const tailLayout = {
    wrapperCol: { offset: 0, span: 16 },
  };
  if (isFetching) return (<FullScreenPreloader />);
  return (
    <div className={classes.SignIn}>
      <img src={logo} alt="Reactia logo" className={classes.logo} />
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
      >
        <Form.Item {...layout}>
          <Title level={2}>Sign in</Title>
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Please input your phone!' }]}
        >
          <Input
            type="tel"
            size="large"
            prefix={<PhoneOutlined />}
            disabled={confirmRes}
            placeholder="Your phone"
            autoComplete="true"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: 'Please input your code!' }]}
        >
          <Input
            type="number"
            size="large"
            prefix={<LockOutlined />}
            placeholder="Code from message"
            style={{
              display: !confirmRes ? 'none' : '',
            }}
            onChange={(e) => setCode(e.target.value)}
            required
            autoComplete="true"
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" onClick={signIn} icon={loading ? <Loading3QuartersOutlined spin /> : confirmRes ? <LoginOutlined /> : <SendOutlined />}>
            {
              loading
                ? 'Loading'
                : confirmRes
                  ? 'Login'
                  : 'Get code'
            }
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isFetching: state.users.isFetching,
  isLogged: state.users.isLogged,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  login: (user: User) => {
    dispatch(loginThunk(user));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SignIn);
