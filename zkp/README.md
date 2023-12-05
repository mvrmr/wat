# Confidential Transactions using Zero-Knowledge Proofs

Pre-requisites:

1. Circom (which also depends on Rust)
2. Node JS

### Build Instructions

cd to wat/zkp directory for all instructions below.

1. Pre-requisites

	npm init	<-- Just leave all default values
	npm i snarkjs
	npm i circomlibjs
	npm i circomlib
	npm i commander

2. Sender ZKP

In the first step, we compile the circuit by the circom compiler that will generate a wasm and an r1cs file.
```
circom src/circom/confidential_transaction_sender.circom --wasm --r1cs -o ./build/circom
```

Now we can generate the proving key (zkey file) by using the circuit and the ptau file:
```
snarkjs groth16 setup build/circom/confidential_transaction_sender.r1cs data/powersOfTau28_hez_final_12.ptau keys/sender_proving_key.zkey
```

Now generate the verification key from the proving key 
```
snarkjs zkey export verificationkey keys/sender_proving_key.zkey keys/sender_verification_key.json
```

Now generate a verifier for smart contracts (Solidity)
```
snarkjs zkey export solidityverifier keys/sender_proving_key.zkey build/solidity/sender_verifier.sol
```
The generated solidity code can be installed on-chain

3. RECEIVER ZK-SNARK

In the first step, we compile the circuit by the circom compiler that will generate a wasm and an r1cs file.
```
circom src/circom/confidential_transaction_receiver.circom --wasm --r1cs -o ./build/circom
```

Now we can generate the proving key (zkey file) by using the circuit and the ptau file:
```
snarkjs groth16 setup build/circom/confidential_transaction_receiver.r1cs data/powersOfTau28_hez_final_12.ptau keys/receiver_proving_key.zkey
```

Now generate the verification key from the proving key 
```
snarkjs zkey export verificationkey keys/receiver_proving_key.zkey keys/receiver_verification_key.json
```

Now generate a verifier for smart contracts (Solidity)
```
snarkjs zkey export solidityverifier keys/receiver_proving_key.zkey build/solidity/receiver_verifier.sol
```
The generated solidity code can be installed on-chain

###Run sender and receiver tests in NodeJS
1.  Run the Sender Prover and Verifier in NodeJS
```
node src/js/sender_test.js --sendamount=100 --senderstartingbalance=1000
```

To pass the jsonCallData output to Solidity verification contract (on-chain):
a. Remove trailing "n" from all numbers
b. first and last "[" "]"
c. Remove all all carriage returns/line feeds


2. Run the Receiver Prover and Verifier in NodeJS
```
node src/js/receiver_test.js --sendamount=100 --receiverstartingbalance=1000
```

To pass the jsonCallData output to Solidity verification contract (on-chain):
a. Remove trailing "n" from all numbers
b. first and last "[" "]"
c. Remove all all carriage returns/line feeds


