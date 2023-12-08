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
      '-a,  --receiversalt <Random Salt owned by Receiver>',
      'Overwriting value.',
      '0',
    )
    .parse(process.argv);
  const options = commander.opts();

  // Define private witness input variables and intermediary signals
  const receiverSalt = Number(`${options.receiversalt}`);

  // Calculate public Hash values
  // This step is not required.  It's only used to manually verify the hashes that are produced int he circuit
  const poseidon = await circomlibjs.buildPoseidon();
  const zeroBalanceHash = poseidon.F.toString(poseidon([receiverSalt]));
  console.log(`zeroBalanceHash='${zeroBalanceHash}'`);

  // Run the circuit, generating the proof
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      accountSalt: receiverSalt,
    },
    'build/circom/confidential_transaction_new_account_js/confidential_transaction_new_account.wasm',
    'keys/new_account_proving_key.zkey',
  );
  console.log(`publicSignals:\n`, publicSignals);
  console.log(`proof:\n`, proof);

  // Verify that the proof is valid
  const vKey = JSON.parse(
    fs.readFileSync('keys/new_account_verification_key.json'),
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
