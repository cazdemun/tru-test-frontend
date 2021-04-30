import React from 'react';
import { Col, InputNumber, Space, Spin, Button, Statistic, Card, Form } from 'antd';
import { trace } from '../utils';
import BigNumber from "bignumber.js";
const Bank = ({ current, send }) => {
  const [depositForm] = Form.useForm()
  const [withdrawForm] = Form.useForm()

  return (
    <Col offset={2} span={20}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'start',
        minHeight: '100vh', justifyContent: 'center'
      }}>
      {current.matches('main.idle') ?
        <Space direction='vertical' style={{ width: '100%' }}>
          <Card style={{ width: '75%' }}>
            <Statistic title="Bank Account"
              value={current.context.piggyBankAddress}
              precision={2} />
          </Card>
          <Card style={{ width: '75%' }}>
            <Statistic title="Account Balance (ETH)"
              value={current.context.web3.utils.fromWei(current.context.funds.toString())}
              precision={2} />
          </Card>

          <Card style={{ width: '75%' }}>
            <Form form={depositForm}
              onFinish={(values => {
                const amount = current.context.web3.utils.toWei(values.deposit.toString());
                send('DEPOSIT', {
                  data: amount
                })
              })}
            >
              <Form.Item label='Amount to deposit (ETH)'
                name='deposit'
                rules={[{
                  required: true,
                  message: 'Please input a quantity'
                },
                {
                  validator: (_, value) => {
                    const toWithdraw = BigNumber(current.context.web3.utils.toWei(value.toString()).toString());
                    return toWithdraw.gt(BigNumber(0)) ?
                      Promise.resolve() : Promise.reject(new Error('Amount should be more than zero!'))
                  }
                }]}>
                <InputNumber min="0" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">
                  Deposit
                </Button>
              </Form.Item>
            </Form>

            <Form form={withdrawForm}
              onFinish={(values => {
                const amount = current.context.web3.utils.toWei(values.withdraw.toString());
                send('WITHDRAW', {
                  data: trace(amount)
                })
              })}
            >
              <Form.Item label='Amount to withdraw (ETH)'
                name='withdraw'
                rules={[
                  {
                    required: true,
                    message: 'Please input a quantity'
                  },
                  {
                    validator: (_, value) => {
                      const toWithdraw = BigNumber(current.context.web3.utils.toWei(value.toString()).toString());
                      const currentFunds = BigNumber(current.context.funds.toString())
                      return currentFunds.gte(toWithdraw) ?
                        Promise.resolve() : Promise.reject(new Error('Not enough funds!'))
                    }
                  },
                  {
                    validator: (_, value) => {
                      const toWithdraw = BigNumber(current.context.web3.utils.toWei(value.toString()).toString());
                      return toWithdraw.gt(BigNumber(0)) ?
                        Promise.resolve() : Promise.reject(new Error('Amount should be more than zero!'))
                    }
                  }]}>
                <InputNumber min="0" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">
                  Withdraw
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
        : null}

      {current.matches('main.placingFunds') || current.matches('main.withdrawingFunds') ?
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
          <Spin size="large" />
          <h1>Please wait until transaction is complete.</h1>
        </Space> : null}
    </Col >
  );
}

export default Bank;