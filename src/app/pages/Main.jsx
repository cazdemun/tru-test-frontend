import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { appMachine } from '../machines/mainMachine';
import { Layout } from 'antd';
import Loading from './Loading';
import Register from './Register';
import Bank from './Bank';

const { Content } = Layout

const Main = () => {
  const [current, send] = useMachine(appMachine)

  useEffect(() => {
    if (current.context.web3 && window.ethereum)
      window.ethereum.on('accountsChanged', accounts => send('METAMASK_UPDATE'));

    // ethereum.on('chainChanged', (chainId) => {
    //   window.location.reload();
    // });
  }, [current.context.web3])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        {current.matches('loading') ?
          <Loading {...{ current, send }} /> : null}
        {current.matches('register') ?
          <Register {...{ current, send }} /> : null}
        {current.matches('main') ?
          <Bank {...{ current, send }} /> : null}
      </Content>
    </Layout>
  );
}

export default Main;