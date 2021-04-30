import { assign } from 'xstate';
import { depositFunds, getFunds, withdrawFunds } from '../contract.utils';

export const mainStates = {
  initial: 'gettingFunds',
  states: {
    gettingFunds: {
      invoke: {
        src: (context) => getFunds(context.web3, context.piggyBankAddress),
        onDone: {
          target: 'idle',
          actions: assign({ funds: (_, event) => event.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    idle: {
      on: {
        'DEPOSIT': 'placingFunds',
        'WITHDRAW': 'withdrawingFunds'
      }
    },
    placingFunds: {
      invoke: {
        src: (context, event) => depositFunds(context.web3, context.userAddress,
          context.piggyBankAddress, event.data),
        // context.piggyBankAddress, context.web3.utils.toWei('0.1')),
        onDone: {
          target: 'idle',
          actions: assign({ funds: (_, event) => event.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    withdrawingFunds: {
      invoke: {
        src: (context, event) => withdrawFunds(context.web3, context.userAddress,
          context.piggyBankAddress, event.data),
        // context.piggyBankAddress, context.web3.utils.toWei('0.05')),
        onDone: {
          target: 'idle',
          actions: assign({ funds: (_, event) => event.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    failure: {
      'always': 'idle'
    }
  }
}
