pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template ConfidentialTransactionNewAccount() {
    /*
	w.startingBalance == 0 && 					  			// Are we initializing the account with zero value?
	hash(accountSalt) == x.zeroBalanceHash &&				  		// Is the Initial Balance has representing a zero value?
    */
    signal input accountSalt;

    signal zeroBalance <== 0;

    signal output zeroBalanceHash;

    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== zeroBalance + accountSalt;
    zeroBalanceHash <== poseidon.out;
}

component main = ConfidentialTransactionNewAccount();

