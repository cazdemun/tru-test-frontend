import { assign } from 'xstate';
import { deployPiggyBankAccount } from '../contract.utils';

export const registerStates = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        'REGISTER': 'deployingPiggyBankAccount'
      }
    },
    deployingPiggyBankAccount: {
      invoke: {
        src: (context) => deployPiggyBankAccount(context.web3, context.userAddress, context.factoryAddress),
        onDone: {
          target: 'sendingEmail',
          actions: assign({ piggyBankAddress: (_, event) => event.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    sendingEmail: {
      'always': 'success'
    },
    success: {
      'always': '#piggybank.main'
    },
    failure: {}
  }
}