import Web3 from "web3";
import PiggyBankFactory from '../contracts/PiggyBankFactory.json'
import PiggyBank from '../contracts/PiggyBank.json'
import { traceTag } from './utils';

// Loading State

export const checkWeb3 = () => new Promise((resolve, reject) => {
  if (window.ethereum) {
    traceTag('checkWeb3')(true);
    resolve(new Web3(window.ethereum));
  } else {
    reject('Metamask not found! Please install Metamask')
  }
})

export const askPermission = () => new Promise((resolve, reject) => {
  window.ethereum.request({
    method: 'eth_requestAccounts'
  })
    .then(res => traceTag('askPermission')(res))
    .then(([firstAccount]) => resolve(firstAccount))
    .catch(err => reject(traceTag('askPermission')(err)));
})

export const checkRegister = (web3, userAddress, factoryAddress) =>
  new Promise((resolve, reject) => {
    const piggyBankFactory = new web3.eth.Contract(PiggyBankFactory.abi, factoryAddress);
    piggyBankFactory.methods.getPiggyBankAccount()
      .call({ from: userAddress })
      .then(piggyBankAddress =>
        web3.utils.isAddress(traceTag('checkRegister')(piggyBankAddress)) ?
          resolve(piggyBankAddress)
          : reject('piggyBankAddress is not a valid address'))
      .catch(error => reject(traceTag('checkRegister')(error)));
  })

// Register State

export const deployPiggyBankAccount = (web3, userAddress, factoryAddress) =>
  new Promise((resolve, reject) => {
    const piggyBankFactory = new web3.eth.Contract(PiggyBankFactory.abi, factoryAddress);
    piggyBankFactory.once('UserRegistered', {
      filter: { user: [userAddress] },
      fromBlock: 0
    }, (error, event) => {
      if (error)
        reject(error)
      else {
        console.log(event);
        piggyBankFactory.methods.getPiggyBankAccount()
          .call({ from: userAddress })
          .then(piggyBankAddress => resolve(traceTag('deployPiggyBankAccount')(piggyBankAddress)))
          .catch(error => reject(error));
      }
    });

    piggyBankFactory.methods.register()
      .send({ from: userAddress })
      .then(_ => console.log('register tx sent'))
      .catch(error => reject(error));
  })

// Main State

export const getFunds = (web3, piggyBankAddress) =>
  new Promise((resolve, reject) => {
    web3.eth.getBalance(piggyBankAddress)
      .then(weis => resolve(traceTag('getFunds')(weis.toString())))
      .catch(error => reject(error))
  })

export const depositFunds = (web3, userAddress, piggyBankAddress, funds) =>
  new Promise((resolve, reject) => {
    const piggyBank = new web3.eth.Contract(PiggyBank.abi, piggyBankAddress);
    piggyBank.once('ReceiveFunds', {
      filter: { user: [userAddress] },
      fromBlock: 0
    }, (error, event) => {
      if (error)
        reject(error)
      else {
        console.log(event);
        web3.eth.getBalance(piggyBankAddress)
          .then(weis => resolve(traceTag('depositFunds')(weis.toString())))
          .catch(error => reject(error))
      }
    });

    web3.eth.sendTransaction({
      from: userAddress,
      to: piggyBankAddress,
      value: funds
    })
      .then(_ => console.log('desposit tx sent'))
      .catch(error => reject(error));
  })

export const withdrawFunds = (web3, userAddress, piggyBankAddress, funds) =>
  new Promise((resolve, reject) => {
    const piggyBank = new web3.eth.Contract(PiggyBank.abi, piggyBankAddress);
    piggyBank.once('WithdrawFunds', {
      filter: { user: [userAddress] },
      fromBlock: 0
    }, (error, event) => {
      if (error)
        reject(error)
      else {
        console.log(event);
        web3.eth.getBalance(piggyBankAddress)
          .then(weis => resolve(traceTag('withdrawFunds')(weis.toString())))
          .catch(error => reject(error))
      }
    });

    piggyBank.methods.withdraw(funds)
      .send({ from: userAddress })
      .then(_ => console.log('withdraw tx sent'))
      .catch(error => reject(error));
  })