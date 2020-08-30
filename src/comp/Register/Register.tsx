import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Button, Input, message, Upload,
} from 'antd';
import { RootState } from '../../store';
import { registerThunk } from '../../bll/reducers/userReducer';

const Register = ({ isRegistered, register, user }: ConnectedProps<typeof connector>) => {
  const [img, setImg] = useState<string>();
  const [file, setFile] = useState<File>();
  const [nickname, setNickname] = useState<string>();
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
  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {!img ? 'Upload a file' : <img src={img} alt={'Avatar'} />}
      </Upload>
      <Input placeholder="Basic usage" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <Button onClick={() => register(file as File, nickname as string, user.id)}>
        Register
      </Button>
    </>
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
