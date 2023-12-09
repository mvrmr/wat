import { Injectable } from '@nestjs/common';
import { utils } from 'ffjavascript';
import snarkjs = require('snarkjs');
import { readFileSync } from 'node:fs';
import circomlibjs = require('circomlibjs');
import { ethersProvider, providers } from 'src/utils';
import { ethers } from 'ethers';
import { RegisterUserDto } from './wat.dto';
import { config } from 'src/config';

@Injectable()
export class WATService {
  senderTest = async function (
    sendAmount: number,
    senderStartingBalance: number,
    senderSalt: number,
  ): Promise<any> {
    const senderEndingBalance = senderStartingBalance - sendAmount;

    // Calculate public Hash values
    // This step is not required.  It's only used to manually verify the hashes that are produced int he circuit
    const poseidon = await circomlibjs.buildPoseidon();
    const senderStartingBalanceHash = poseidon.F.toString(
      poseidon([senderStartingBalance + senderSalt]),
    );
    const senderEndingBalanceHash = poseidon.F.toString(
      poseidon([senderEndingBalance + senderSalt]),
    );
    const sendAmountHash = poseidon.F.toString(
      poseidon([sendAmount + senderSalt]),
    );

    // Run the circuit, generating the proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      {
        senderSalt: senderSalt,
        senderStartingBalance: senderStartingBalance,
        sendAmount: sendAmount,
      },
      'build/circom/confidential_transaction_sender_js/confidential_transaction_sender.wasm',
      'keys/sender_proving_key.zkey',
    );

    console.log(
      `senderStartingBalance='${senderStartingBalance}'; senderStartingBalanceHash='${senderStartingBalanceHash}'\n`,
      `senderEndingBalance='${senderEndingBalance}'; senderEndingBalanceHash='${senderEndingBalanceHash}'\n`,
      `sendAmount='${sendAmount}'; sendAmountHash='${sendAmountHash}'\n`,
      `publicSignals:\n`,
      publicSignals,
      `proof:\n`,
      proof,
    );

    // Verify that the proof is valid
    const vKey = JSON.parse(
      readFileSync('keys/sender_verification_key.json').toString(),
    );

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
      console.log('Verification OK');

      // Now print the call data for running the verification on-chain
      const rawCallData = await snarkjs.groth16.exportSolidityCallData(
        proof,
        publicSignals,
      );
      const jsonCallData = utils.unstringifyBigInts(
        JSON.parse(`[${rawCallData}]`),
      );
      console.log(`jsonCallData:\n`, jsonCallData);

      return {
        senderStartingBalance,
        sendAmount,
        senderEndingBalance,
        senderStartingBalanceHash,
        senderEndingBalanceHash,
        sendAmountHash,
        publicSignals,
        proof,
        // jsonCallData_Type: typeof jsonCallData,
        stringJsonCallData: String(jsonCallData),
      };
    } else {
      console.log('Invalid proof');
    }
  };

  // 0xFB62886F274aDBa10797B1B67810A47F8Ecb632A   Akash testnet public address
  registerUser = async function (
    registUserInput: RegisterUserDto,
  ): Promise<any> {
    console.log({ registUserInput });

    // const senderWallet = new ethers.Wallet(
    //   fromEthAddressPrvKey,
    //   ethersProvider,
    // );
    // const sendEtherTransaction = await senderWallet.sendTransaction({
    //   to: toEthAddress,
    //   gasLimit: 30000000,
    //   value: ethers.utils.parseEther('10'),
    // });
    const localAnvilEthBalance = await ethersProvider.getBalance(
      registUserInput.userAddress,
    );

    const userBalanceOnNetwork = await providers[
      String(registUserInput.network)
    ].getBalance(registUserInput.userAddress);

    const balanceID = `${String(registUserInput.network)}TestBalance`;
    return {
      userAddress: registUserInput.userAddress,
      localAnvilBalance: ethers.utils.formatEther(localAnvilEthBalance),
      [balanceID]: ethers.utils.formatEther(userBalanceOnNetwork),
      [`${String(registUserInput.network)}WEB3_RPC_URL`]:
        config[String(registUserInput.network)].web3RPCURL,
      // [String(registUserInput.network)]_WEB3_PROVIDER: config[String(registUserInput.network)].web3RPCURL,
    };
    // // return ethBalance.toNumber();
  };
}
