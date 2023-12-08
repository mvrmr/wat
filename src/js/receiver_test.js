const { utils } = require('ffjavascript');
const { unstringifyBigInts } = utils;
const snarkjs = require('snarkjs');
const fs = require('fs');
const circomlibjs = require('circomlibjs');
const commander = require('commander');

(async function () {
  // Use commander library to parse command line inputs
  commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option(
      '-a, --sendamount <Amount of Tokens to Transfer>',
      'Overwriting value.',
      '0',
    )
    .option(
      '-b, --receiverstartingbalance <Staring Balance of Receiver Account>',
      'Overwriting value.',
      '0',
    )
    .option(
      '-s,  --receiversalt <Random Salt owned by Receiver>',
      'Overwriting value.',
      '0',
    )
    .parse(process.argv);
  const options = commander.opts();

  // Define private witness input variables and intermediary signals
  const receiverSalt = Number(`${options.receiversalt}`);
  const sendAmount = Number(`${options.sendamount}`);
  const receiverStartingBalance = Number(`${options.receiverstartingbalance}`);
  const receiverEndingBalance = receiverStartingBalance + sendAmount;

  // Calculate public Hash values
  // This step is not required.  It's only used to manually verify the hashes that are produced int he circuit
  const poseidon = await circomlibjs.buildPoseidon();
  const receiverStartingBalanceHash = poseidon.F.toString(
    poseidon([receiverStartingBalance + receiverSalt]),
  );
  console.log(
    `receiverStartingBalance='${receiverStartingBalance}'; receiverStartingBalanceHash='${receiverStartingBalanceHash}'`,
  );
  const receiverEndingBalanceHash = poseidon.F.toString(
    poseidon([receiverEndingBalance + receiverSalt]),
  );
  console.log(
    `receiverEndingBalance='${receiverEndingBalance}'; receiverEndingBalanceHash='${receiverEndingBalanceHash}'`,
  );
  const sendAmountHash = poseidon.F.toString(
    poseidon([sendAmount + receiverSalt]),
  );
  console.log(`sendAmount='${sendAmount}'; sendAmountHash='${sendAmountHash}'`);

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
  console.log(`publicSignals:\n`, publicSignals);
  console.log(`proof:\n`, proof);

  // Verify that the proof is valid
  const vKey = JSON.parse(
    fs.readFileSync('keys/receiver_verification_key.json'),
  );

  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log('Verification OK');

    // Now print the call data for running the verification on-chain
    const rawCallData = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals,
    );
    jsonCallData = unstringifyBigInts(JSON.parse(`[${rawCallData}]`));
    console.log(`jsonCallData:\n`, jsonCallData);
  } else {
    console.log('Invalid proof');
  }

  process.exit(0);
})();
