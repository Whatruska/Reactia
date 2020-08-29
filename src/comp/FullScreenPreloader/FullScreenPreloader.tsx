import React from 'react';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import classes from './FullScreenPreloader.module.css';

const FullScreenPreloader = () => (
    <div className={classes.preloaderWrapper}>
      <LoadingOutlined spin style={{ fontSize: '10em' }} />
    </div>
);

export default FullScreenPreloader;
