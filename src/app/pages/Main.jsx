import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { appMachine } from '../machines/mainMachine';
import { Button } from 'antd';

const Main = () => {
  const [current, send] = useMachine(appMachine)

  useEffect(() => {
    if (current.context.web3 && window.ethereum)
      window.ethereum.on('accountsChanged', accounts => send('METAMASK_UPDATE'));

    // ethereum.on('chainChanged', (chainId) => {
    //   window.location.reload();
    // });
  }, [current.context.web3])

  return (<>
    <pre>{JSON.stringify({
      ...current.context,
      web3: current.context.web3 ? true : null
    }, null, 2)}</pre>
    <pre>{JSON.stringify(current.value, null, 2)}</pre>
    {current.matches('register.idle') ?
      <Button onClick={() => send('REGISTER')}>Register</Button>
      : null}
    {current.matches('main.idle') ?
      <>
        <Button onClick={() => send('DEPOSIT')}>
          Deposit 0.1 ether
        </Button>
        <Button onClick={() => send('WITHDRAW')}>
          Withdraw 0.05 ethers
        </Button>
      </>
      : null}
  </>
  );
}

export default Main;