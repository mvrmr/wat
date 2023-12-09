import * as dotenv from 'dotenv';

//Load env vars from env file
dotenv.config();

const configs: any = {
  blockchain: {
    binance: {
      name: 'binance',
      web3RPCURL: process.env.BINANCE_WEB3_PROVIDER,
      contract: {
        notarization: process.env.BINANCE_CONTRACT_ADDRESS,
      },
      resultArray: 0,
      ethGasPriceAPI: {
        url: process.env.BSC_URL,
        method: 'post',
        data: { jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 },
        headers: { 'Content-Type': 'application/json' },
        resultKey: 'result',
      },
      symbol: 'BNB',
      explorerURL: 'https://testnet.bscscan.com/tx/',
    },
    polygon: {
      name: 'polygon',
      web3RPCURL: process.env.POLYGON_MUMBAI_RPC_URL,
      contract: {
        notarization: process.env.POLYGON_CONTRACT_ADDRESS,
      },
      resultArray: 1,
      ethGasPriceAPI: {
        url: process.env.MATIC_INFURA_URL,
        method: 'post',
        data: { jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 },
        headers: { 'Content-Type': 'application/json' },
        resultKey: 'result',
      },
      symbol: 'MATIC',
      explorerURL: 'https://mumbai.polygonscan.com/tx/',
    },
    localAnvil: {
      name: 'localAnvil',
      web3RPCURL: process.env.LOCAL_RPC_URL,
      contract: {
        notarization: process.env.ETHEREUM_CONTRACT_ADDRESS,
      },
      resultArray: 0,
      ethGasPriceAPI: {
        url: process.env.GOERLI_INFURA_URL,
        method: 'post',
        data: { jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 },
        headers: { 'Content-Type': 'application/json' },
        resultKey: 'result',
      },
    },
    ethereum: {
      name: 'ethereum',
      web3RPCURL: process.env.ETHEREUM_WEB3_PROVIDER,
      contract: {
        notarization: process.env.ETHEREUM_CONTRACT_ADDRESS,
      },
      resultArray: 0,
      ethGasPriceAPI: {
        url: process.env.GOERLI_INFURA_URL,
        method: 'post',
        data: { jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 },
        headers: { 'Content-Type': 'application/json' },
        resultKey: 'result',
      },
      symbol: 'ETH',
      explorerURL: 'https://goerli.etherscan.io/tx/',
    },
  },
};

export const config = Object.assign(configs.blockchain);
