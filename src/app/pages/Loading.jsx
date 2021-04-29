import React from 'react';
import { Col, Space, Spin, Button } from 'antd';

const Loading = ({ current, send }) => {
  return (
    <Col offset={2} span={20}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: '100vh', justifyContent: 'center'
      }}>
      <Space direction="vertical" style={{ textAlign: 'center' }}>
        <Spin size="large" />
        <h1>Loading Metamask, if you see this message, please connect this application to your account. </h1>
        {current.matches('loading.permissionDenied') ? <>
          <p style={{ color: 'red' }}>Please connect with Metamask.</p>
          <Button onClick={() => send('RETRY')} >Retry</Button>
        </> : null}
        {current.matches('loading.failure') ?
          <p style={{ color: 'red' }}>Something happened, please refresh the page</p>
          : null}
      </Space>
    </Col>
  );
}

export default Loading;