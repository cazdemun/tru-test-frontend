import { Machine } from 'xstate';
import { loadingStates } from './loadingStates';
import { registerStates } from './registerStates';
import { mainStates } from './mainStates';

export const appMachine = Machine({
  id: 'piggybank',
  context: {
    web3: null,
    error: null,
    // network: 'test',
    // factoryAddress: '0x118f23fEE5b9C44B794c0d77c581c1b02D4794D1',
    network: 'ropsten',
    factoryAddress: '0x2e95B50924bCe79E67e31A3c111C3669d5741F82',
    piggyBankAddress: null,
    userAddress: null,
    funds: null,
    email: null
  },
  initial: 'loading',
  states: {
    loading: {
      ...loadingStates
    },
    register: {
      ...registerStates
    },
    main: {
      ...mainStates
    }
  },
  on: {
    'METAMASK_UPDATE': '#piggybank.loading.checkingWeb3'
  },
});