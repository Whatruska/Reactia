import React, { SyntheticEvent, useState } from 'react';
import firebase from 'firebase';
import { Redirect, useHistory } from 'react-router-dom';
import {
  Button, Input, Typography, Form,
} from 'antd';
import {
  PhoneOutlined, LockOutlined, LoginOutlined, SendOutlined, Loading3QuartersOutlined,
} from '@ant-design/icons';
import logo from '../../assets/img/Reactia_logo.png';
import classes from './SignIn.module.css';

const { Title } = Typography;

const SignIn = () => {
  const history = useHistory();
  const [confirmRes, setConfirmRes] = useState();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha-container', {
    size: 'invisible',
  });
  const signIn = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!confirmRes) {
      firebase.auth().signInWithPhoneNumber(phone, recaptchaVerifier)
        .then((confirmationResult) => {
          setConfirmRes(confirmationResult);
          alert('Check your phone');
        }).catch((error) => {
          alert(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      confirmRes.confirm(code).then((result:any) => {
        const { user } = result;
        window.localStorage.setItem('user', JSON.stringify(user));
        history.push('/');
      }).finally(() => {
        setLoading(false);
      });
    }
  };
  if (window.localStorage.getItem('user')) return (<Redirect to="/" />);
  const layout = {
    wrapperCol: { span: 60 },
  };
  const tailLayout = {
    wrapperCol: { offset: 0, span: 16 },
  };

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
          <Input type="tel" size="large" prefix={<PhoneOutlined />} placeholder="Your phone" autoComplete="true" onChange={(e) => setPhone(e.target.value)} />
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

export default SignIn;
