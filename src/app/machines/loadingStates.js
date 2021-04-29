import { assign } from 'xstate';
import { checkWeb3, askPermission, checkRegister } from '../contract.utils';

const isNotRegistered = (_, event) => {
  return event.data === '0x0000000000000000000000000000000000000000';
};

const isRegistered = (_, event) => {
  return event.data !== '0x0000000000000000000000000000000000000000';
};

export const loadingStates = {
  initial: 'checkingWeb3',
  states: {
    // Checks if Metamask is installed
    checkingWeb3: {
      invoke: {
        src: checkWeb3,
        onDone: {
          target: 'askingMetamaskPermission',
          actions: assign({ web3: (_, event) => event.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    // Checks if any account has Metamask permission
    askingMetamaskPermission: {
      invoke: {
        src: askPermission,
        onDone: {
          target: 'confirmingAccount',
          actions: assign({ userAddress: (_, event) => event.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: 'Please refresh the page and accept Metamask permission' })
        }
      }
    },
    // Confirm current Metamask account is the desired one
    confirmingAccount: {
      'always': 'checkingNetwork'
    },
    // Confirm current network is the desired one
    checkingNetwork: {
      'always': 'checkingRegister'
    },
    // Check if user already has an account on factory
    checkingRegister: {
      invoke: {
        src: (context) => checkRegister(context.web3, context.userAddress, context.factoryAddress),
        onDone: [{
          target: 'success',
          cond: isRegistered,
          actions: assign({ piggyBankAddress: (_, event) => event.data })
        },
        {
          target: '#piggybank.register',
          cond: isNotRegistered
        }],
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    failure: {},
    success: {
      'always': '#piggybank.main'
    }
  }
}