const { utils } = require("ffjavascript");
const { unstringifyBigInts } = utils;
const snarkjs = require("snarkjs");
const fs = require("fs");
const circomlibjs = require("circomlibjs");
const commander = require("commander");

(async function () {
  // Use commander library to parse command line inputs
  commander
    .version("1.0.0", "-v, --version")
    .usage("[OPTIONS]...")
    .option(
      "-a, --sendamount <Amount of Tokens to Transfer>",
      "Overwriting value.",
      "0"
    )
    .option(
      "-b, --senderstartingbalance <Staring Balance of Sender Account>",
      "Overwriting value.",
      "0"
    )
    .option(
     '-s, --sendersalt <Random Salt owned by Sender>', 
     'Overwriting value.', 
     '0')
    .parse(process.argv);
  const options = commander.opts();

  // Define private witness input variables and intermediary signals
  const senderSalt = Number(`${options.sendersalt}`);
  const sendAmount = Number(`${options.sendamount}`);
  const senderStartingBalance = Number(`${options.senderstartingbalance}`);
  const senderEndingBalance = senderStartingBalance - sendAmount;

  // Calculate public Hash values
  // This step can be skipped.. it's used only for manual validatoin of the hashed produced by the circuit
  const poseidon = await circomlibjs.buildPoseidon();
  const senderStartingBalanceHash = poseidon.F.toString(
    poseidon([senderStartingBalance])
  );
  console.log(
    `senderStartingBalance='${senderStartingBalance}'; senderStartingBalanceHash='${senderStartingBalanceHash}'`
  );
  const senderEndingBalanceHash = poseidon.F.toString(
    poseidon([senderEndingBalance])
  );
  console.log(
    `senderEndingBalance='${senderEndingBalance}'; senderEndingBalanceHash='${senderEndingBalanceHash}'`
  );
  const sendAmountHash = poseidon.F.toString(poseidon([sendAmount]));
  console.log(`sendAmount='${sendAmount}'; sendAmountHash='${sendAmountHash}'`);

  // Run the circuit to generate the proof
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      senderSalt: senderSalt,
      senderStartingBalance: senderStartingBalance,
      sendAmount: sendAmount,
    },
    "build/circom/confidential_transaction_sender_js/confidential_transaction_sender.wasm",
    "keys/sender_proving_key.zkey"
  );
  console.log(`publicSignals:\n`, publicSignals);
  console.log(`proof:\n`, proof);

  // Now Verifiy the proof is valid
  const vKey = JSON.parse(fs.readFileSync("keys/sender_verification_key.json"));
  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log("Verification OK");

    // Now print the call data for running the verification on-chain
    const rawCallData = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );
    jsonCallData = unstringifyBigInts(JSON.parse(`[${rawCallData}]`));
    console.log(`jsonCallData:\n`, jsonCallData);
  } else {
    console.log("Invalid proof");
  }

  process.exit(0);
})();
