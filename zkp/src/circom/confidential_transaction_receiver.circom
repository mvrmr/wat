pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template ConfidentialTransactionReceiver() {
    /*
	hash(w.sendAmount) == x.sendAmountHash &&					// Is the receiver correctly stating the number of tokens being transfered?
	hash(w.receiverStartingBalance) == x.receiverStartingBalanceHash &&		// Is the receiver correctly stating their starting balance?
	hash(w.receiverStartingBalance + w.sendAmount) == x.receiverrEndingBalanceHash	// Is the receiver correctly stating their ending balance?
    */
    signal input receiverStartingBalance;
    signal input sendAmount;

    signal receiverEndingBalance <== receiverStartingBalance + sendAmount;

    signal output receiverStartingBalanceHash;
    signal output receiverEndingBalanceHash;
    signal output sendAmountHash;

    component poseidon1 = Poseidon(1);
    poseidon1.inputs[0] <== sendAmount;
    sendAmountHash <== poseidon1.out;

    component poseidon2 = Poseidon(1);
    poseidon2.inputs[0] <== receiverStartingBalance;
    receiverStartingBalanceHash <== poseidon2.out;

    component poseidon3 = Poseidon(1);
    poseidon3.inputs[0] <== receiverEndingBalance;
    receiverEndingBalanceHash <== poseidon3.out;
}

component main = ConfidentialTransactionReceiver();

