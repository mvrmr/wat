pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template ConfidentialTransactionSender() {
    /*
	w.senderStartingBalance >= w.sendAmount && 				  // Does sender own enough tokens to send?
	hash(w.sendAmount) == x.sendAmountHash &&				  // Is the sender correctly stating the number of tokens being transfered?
	hash(w.senderStartingBalance) == x.senderStartingBalanceHash &&		  // Is the sender correctly stating their starting balance?
	hash(w.senderStartingBalance - w.sendAmount) == x.senderEndingBalanceHash // Is the sender correctly stating their ending balance?
    */
    signal input senderStartingBalance;
    signal input sendAmount;

    signal senderEndingBalance <== senderStartingBalance - sendAmount;

    signal output senderStartingBalanceHash;
    signal output senderEndingBalanceHash;
    signal output sendAmountHash;

    assert(senderStartingBalance >= sendAmount);

    component poseidon1 = Poseidon(1);
    poseidon1.inputs[0] <== sendAmount;
    sendAmountHash <== poseidon1.out;

    component poseidon2 = Poseidon(1);
    poseidon2.inputs[0] <== senderStartingBalance;
    senderStartingBalanceHash <== poseidon2.out;

    component poseidon3 = Poseidon(1);
    poseidon3.inputs[0] <== senderEndingBalance;
    senderEndingBalanceHash <== poseidon3.out;
}

component main = ConfidentialTransactionSender();

