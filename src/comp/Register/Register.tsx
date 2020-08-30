import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Button, Col, Form, Input, message, Row, Upload,
} from 'antd';
import { RootState } from '../../store';
import { registerThunk, USER_COLLECTION_NAME } from '../../bll/reducers/userReducer';
import { db } from '../../fbconfig';
import logo from '../../assets/img/Reactia_logo.png';

const Register = ({ isRegistered, register, user }: ConnectedProps<typeof connector>) => {
  const [img, setImg] = useState<string>();
  const [file, setFile] = useState<File>();
  const [nickname, setNickname] = useState<string>();
  const [validStatus, setValidStatus] = useState();
  const [feedback, setFeedback] = useState();
  const [names, setNames] = useState<Array<string>>([]);
  useEffect(() => {
    const localNames: Array<string> = [];
    db.collection(USER_COLLECTION_NAME).get().then((querry) => {
      querry.forEach((data) => {
        localNames.push(data.data().username);
      });
    });
    setNames(localNames);
  }, []);
  if (isRegistered) return (<Redirect to="/" />);
  function getBase64(img: File, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(newFile: File) {
    const isJpgOrPng = newFile.type === 'image/jpeg' || newFile.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = newFile.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      const newFile = info.file.originFileObj;
      setFile(newFile);
      getBase64(newFile, (imgUrl: string) => {
        setImg(imgUrl);
      });
    }
  };

  const validNickname = (nick: string) => {
    setNickname(nick);
    setValidStatus('validating');
    const localNames = names.filter((name) => name === nick);
    if (localNames.length) {
      setValidStatus('error');
      setFeedback('Choose another username');
    } else if (nick) {
      setValidStatus('success');
      setFeedback('Everything is OK');
    } else {
      setValidStatus('error');
      setFeedback('Nickname is too short!');
    }
  };

  const onFinish = () => {
    message.success('Successfully registered', 2);
    register(file as File, nickname as string, user.id);
  };

  const onFinishFailed = () => {
    message.error('Error!', 2);
  };

  const validProps = {
    validateStatus: validStatus,
    help: feedback,
  };

  return (
    <Row
      style={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      justify="center"
      align="top"
    >
      <Col
        span={6}
        offset={9}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={logo}
          alt="Reactia logo"
          style={{
            width: '80%',
            marginBottom: '5vh',
          }}
        />
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="avatar"
            rules={[{ required: true, message: 'Please choose your avatar!' }]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {!img ? 'Upload a file' : (
                <img
                  src={img}
                  style={{
                    width: '128px',
                    height: '128px',
                  }}
                  alt="Avatar"
                />
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            hasFeedback
            {...validProps}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" value={nickname} onChange={(e) => validNickname(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  isRegistered: state.users.isRegistered,
  isFetching: state.users.isFetching,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  register: (file: File, username: string, id: string) => {
    dispatch(registerThunk(file, username, id));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Register);
