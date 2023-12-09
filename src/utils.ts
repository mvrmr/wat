import { ethers } from 'ethers';
import { config } from 'src/config';

const ethersProvider = new ethers.providers.JsonRpcProvider(
  config.localAnvil.web3RPCURL,
);
const ethersBinanceProvider = new ethers.providers.JsonRpcProvider(
  config.binance.web3RPCURL,
);
const ethersPolygonProvider = new ethers.providers.JsonRpcProvider(
  config.polygon.web3RPCURL,
);

const providers = {
  localAnvil: ethersProvider,
  binance: ethersBinanceProvider,
  polygon: ethersPolygonProvider,
};

export { providers, ethersProvider };
