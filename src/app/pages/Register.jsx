import { Col, Input, Button, Form, Space, Spin } from 'antd';
import React from 'react';
import { trace } from '../utils';

const Register = ({ current, send }) => {
  const [form] = Form.useForm();

  const handleOk = (values) => {
    form
      .validateFields()
      .then(values => {
        send('REGISTER', { data: trace(values) })
      })
      .catch(err => console.log(err))
  }

  return (
    <Col offset={2} span={20}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: '100vh', justifyContent: 'center'
      }}>
      <h1 style={{ margin: '0px 0px 50px 0px' }}>
        You don't have a Piggy Bank Account, please register in the form below.
      </h1>

      <Form
        form={form}
        style={{ width: '35%' }}
        initialValues={{
          address: trace(current.context.userAddress)
        }}
      >
        <Form.Item name='address'
          label="Address"
        >
          <Input
            placeholder='Address'
            disabled={true}
          />
        </Form.Item>
        <Form.Item name='email'
          label="E-mail"
          rules={[{
            required: true,
            message: 'Please input your email'
          }]}
        >
          <Input
            placeholder='example@example.com'
          />
        </Form.Item>
        <Form.Item>
          <Button
            key="submit" onClick={handleOk}
            style={{ margin: '10px 0px' }}
          >
            Register
          </Button>
        </Form.Item>
      </Form >
      {current.matches('register.deployingPiggyBankAccount')
        || current.matches('register.sendingEmail') ?
        <Space direction="vertical" style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <h1>Please accept the transaction and wait while your account is being deployed...</h1>
        </Space> : null}
      {current.matches('register.failure') ?
        <h1>Something went wrong, please reload the page.</h1>
        : null}
    </Col >
  );
}

export default Register;