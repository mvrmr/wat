import { Injectable } from '@nestjs/common';
import { utils } from 'ffjavascript';
import snarkjs = require('snarkjs');
import { readFileSync } from 'node:fs';
import circomlibjs = require('circomlibjs');

@Injectable()
export class TransferAssetService {
  receiverTest(
    sendAmount: number,
    receiverStartingBalance: number,
    receiverSalt: number,
  ): any {
    return this.runReceivetTest(
      sendAmount,
      receiverStartingBalance,
      receiverSalt,
    );

    // return `About run 'receiver Test' with Parameters sendAmount, receiverStartingBalance, receiverSalt: ${sendAmount}, ${receiverStartingBalance}, ${receiverSalt}`;
  }

  runReceivetTest = async function (
    sendAmount: number,
    receiverStartingBalance: number,
    receiverSalt: number,
  ) {
    const receiverEndingBalance = receiverStartingBalance + sendAmount;

    // Calculate public Hash values
    // This step is not required.  It's only used to manually verify the hashes that are produced int he circuit
    const poseidon = await circomlibjs.buildPoseidon();
    const receiverStartingBalanceHash = poseidon.F.toString(
      poseidon([receiverStartingBalance + receiverSalt]),
    );
    const receiverEndingBalanceHash = poseidon.F.toString(
      poseidon([receiverEndingBalance + receiverSalt]),
    );
    const sendAmountHash = poseidon.F.toString(
      poseidon([sendAmount + receiverSalt]),
    );

    // Run the circuit, generating the proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      {
        receiverSalt: receiverSalt,
        receiverStartingBalance: receiverStartingBalance,
        sendAmount: sendAmount,
      },
      'build/circom/confidential_transaction_receiver_js/confidential_transaction_receiver.wasm',
      'keys/receiver_proving_key.zkey',
    );

    console.log(
      `receiverStartingBalance='${receiverStartingBalance}'; receiverStartingBalanceHash='${receiverStartingBalanceHash}'\n`,
      `receiverEndingBalance='${receiverEndingBalance}'; receiverEndingBalanceHash='${receiverEndingBalanceHash}'\n`,
      `sendAmount='${sendAmount}'; sendAmountHash='${sendAmountHash}'\n`,
      `publicSignals:\n`,
      publicSignals,
      `proof:\n`,
      proof,
    );

    // Verify that the proof is valid
    const vKey = JSON.parse(
      readFileSync('keys/receiver_verification_key.json').toString(),
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
        receiverStartingBalance,
        sendAmount,
        receiverEndingBalance,
        receiverStartingBalanceHash,
        receiverEndingBalanceHash,
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
}
