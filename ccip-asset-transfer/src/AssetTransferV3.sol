// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './verifiers/SenderVerifier.sol';
import './verifiers/ReceiverVerifier.sol';
import './WATMsgReceiver.sol';
import './IWATMsgSender.sol';
import './utils/Withdraw.sol';

contract AssetTransferV3 {
    enum TRANSFER_STATES {
        INITIATE,
        ACCEPT,
        LOCK,
        MINT,
        BURN,
        COMPLETE,
        FAILED
    }

    struct Transfer {
        address owner;
        address receiver;
        uint transferAmount;
        uint ownerCurrentBalance;
        uint ownerAfterBalance;
        uint receiverCurrentBalance;
        uint receiverAfterBalance;
        TRANSFER_STATES state;
        Proofs sourceProof;
        Proofs destProof;
    }

    struct Proofs {
        uint[2] _pA;
        uint[2][2] _pB;
        uint[2] _pC;
    }

    mapping(uint256 => Transfer) public transfers;
    uint256 public transferIdCount;
    uint64 destination;
    address watMsgSender;

    SenderVerifier senderVerifier;
    ReceiverVerifier receiverVerifier;
    address watMsgreceiver;

    mapping(address => uint) public balanceHashes;
    mapping(address => uint) public lockedHashes;

    bytes32 public latestmessage;

    uint public totalSupply;
    uint256 public latestNumber;

    event TransferInitiated(bytes32 latestMessageId, address caller);
    event RequestReceived(uint256 transferId, address owner, address receiver);
    event AssetLocked(uint256 transferId, uint lockedAmount);

    constructor(
        uint _totalSupply,
        address _sVerifier,
        address _rVerifier,
        address _watMsgSender,
        uint64 _destination
    ) {
        senderVerifier = SenderVerifier(_sVerifier);
        receiverVerifier = ReceiverVerifier(_rVerifier);
        destination = _destination;
        watMsgSender = _watMsgSender;
        transferIdCount = 1;
        mint(msg.sender, _totalSupply, _totalSupply);
    }

    function registerUser(address user, uint initialBalance) public {
        // This function will initiate the user in contract
        mint(user, initialBalance, totalSupply);
    }

    function setWatReceiver(address receiver) public {
        watMsgreceiver = receiver;
    }

    function checkSend() public {
        bytes memory msgData = abi.encodeCall(this.checkRec, (uint256(20)));

        bytes32 returnData = IWATMsgSender(watMsgSender).send(
            destination,
            watMsgreceiver,
            msgData
        );

        emit TransferInitiated(returnData, msg.sender);
    }

    function checkRec(uint256 number) public {
        latestNumber = number;
    }

    function mint(
        address user,
        uint balanceHash,
        uint updatedTotalSupply
    ) public {
        balanceHashes[user] = balanceHash;
        totalSupply = updatedTotalSupply;
        transferIdCount = 0;
    }

    function requestAssetTransfer(
        address receiver,
        address owner,
        uint transferAmount,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC
    ) public {
        Proofs memory receiverProof = Proofs({_pA: _pA, _pB: _pB, _pC: _pC});

        transfers[transferIdCount] = Transfer({
            receiver: receiver,
            owner: owner,
            transferAmount: transferAmount,
            ownerCurrentBalance: 0,
            ownerAfterBalance: 0,
            receiverCurrentBalance: balanceHashes[receiver],
            receiverAfterBalance: 0,
            state: TRANSFER_STATES.INITIATE,
            sourceProof: Proofs({
                _pA: [uint(0), uint(0)],
                _pB: [[uint(0), uint(0)], [uint(0), uint(0)]],
                _pC: [uint(0), uint(0)]
            }),
            destProof: receiverProof
        });

        // Construct the call data
        bytes memory callData = abi.encodeCall(
            this.handleTransferRequest,
            (
                transferIdCount,
                receiver,
                owner,
                transferAmount,
                balanceHashes[receiver],
                receiverProof
            )
        );

        bytes32 messageId = IWATMsgSender(watMsgSender).send(
            destination,
            watMsgreceiver,
            callData
        );

        latestmessage = messageId;
        transferIdCount++;
        emit TransferInitiated(messageId, receiver);
    }

    function handleTransferRequest(
        uint256 transferId,
        address receiver,
        address owner,
        uint transferAmount,
        uint receiverCurrentBalance,
        Proofs memory receiverProof
    ) public {
        // Add checks, transferId should not exists

        transfers[transferId] = Transfer({
            receiver: receiver,
            owner: owner,
            transferAmount: transferAmount,
            ownerCurrentBalance: balanceHashes[owner],
            ownerAfterBalance: 0,
            receiverCurrentBalance: receiverCurrentBalance,
            receiverAfterBalance: 0,
            state: TRANSFER_STATES.INITIATE,
            sourceProof: Proofs({
                _pA: [uint(0), uint(0)],
                _pB: [[uint(0), uint(0)], [uint(0), uint(0)]],
                _pC: [uint(0), uint(0)]
            }),
            destProof: receiverProof
        });

        emit RequestReceived(transferId, owner, receiver);
    }

    function lockAsset(
        uint256 transferId,
        uint sourceAfterTotalSupply,
        uint ownerAfteBalance,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC
    ) public {
        Transfer storage transfer = transfers[transferId];
        transfer.sourceProof = Proofs({_pA: _pA, _pB: _pB, _pC: _pC});
        transfer.ownerAfterBalance = ownerAfteBalance;
        transfer.state = TRANSFER_STATES.LOCK;

        //Send CCIP Message
        // Construct the call data
        bytes memory callData = abi.encodeCall(
            this.handleLockMessage,
            (transferIdCount, sourceAfterTotalSupply, _pA, _pB, _pC)
        );

        bytes32 messageId = IWATMsgSender(watMsgSender).send(
            destination,
            watMsgreceiver,
            callData
        );

        emit AssetLocked(transferId, transfer.transferAmount);
    }

    function handleLockMessage(
        uint256 transferId,
        uint ownerAfterBalance,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC
    ) public {
        require(
            transfers[transferId].receiver == msg.sender,
            'Transfer doesnt exists'
        );

        Transfer storage transfer = transfers[transferId];
        transfer.state = TRANSFER_STATES.LOCK;
        transfer.ownerAfterBalance = ownerAfterBalance;
        transfer.sourceProof = Proofs({_pA: _pA, _pB: _pB, _pC: _pC});
    }

    function mintAsset(uint256 transferId) public {
        Transfer storage transfer = transfers[transferId];
        Proofs memory senderProof = transfer.sourceProof;
        // uint[3] calldata _pubSignals = new uint[3];
        uint[3] memory _pubSignals;

        _pubSignals[0] = transfer.ownerCurrentBalance;
        _pubSignals[1] = transfer.ownerAfterBalance;
        _pubSignals[2] = transfer.transferAmount;

        bool ownerBurnProof = senderVerifier.verifyProof(
            senderProof._pA,
            senderProof._pB,
            senderProof._pC,
            _pubSignals
        );

        if (ownerBurnProof) {
            transfer.state = TRANSFER_STATES.MINT;
            balanceHashes[transfer.receiver] = transfer.receiverAfterBalance;
            //balanceHashes[receiver] = transferAmount;
            // Send CCIP messgae MINT SUCCESS
        } else {
            // SEND MINT UNSUCCES
            transfer.state = TRANSFER_STATES.FAILED;
        }
    }

    function handleMintSuccess(uint256 transferId) public {
        Transfer storage transfer = transfers[transferId];
        transfer.state = TRANSFER_STATES.MINT;
    }

    /* To be executed on Source Asset Blockchain*/
    function burnAsset(uint256 transferId) public {
        Transfer storage transfer = transfers[transferId];
        Proofs memory receiverProof = transfer.destProof;

        uint[3] memory _pubSignals;

        _pubSignals[0] = transfer.ownerCurrentBalance;
        _pubSignals[1] = transfer.ownerAfterBalance;
        _pubSignals[2] = transfer.transferAmount;

        bool recProof = receiverVerifier.verifyProof(
            receiverProof._pA,
            receiverProof._pB,
            receiverProof._pC,
            _pubSignals
        );

        if (recProof) {
            transfer.state = TRANSFER_STATES.COMPLETE;
            balanceHashes[transfer.owner] = transfer.ownerAfterBalance;
            //balanceHashes[receiver] = transferAmount;
        } else {
            // SEND MINT UNSUCCES
            transfer.state = TRANSFER_STATES.FAILED;
        }
    }

    function handleBurn(uint256 transferId) public {
        Transfer storage transfer = transfers[transferId];
        transfer.state = TRANSFER_STATES.BURN;
    }

    // Handle FAILED sent from Receiver
    function handleFailedRequestSource(uint256 transferId) public {}

    // Handle FAILED sent from Source(Owner)
    function handleFailedRequestReceiver(uint256 transferId) public {
        Transfer storage transfer = transfers[transferId];
        transfer.state = TRANSFER_STATES.FAILED;

        // reveert to original values;
        balanceHashes[transfer.receiver] = transfer.receiverCurrentBalance;
    }

    function currentTransferState(
        uint256 transferId
    ) public view returns (TRANSFER_STATES currentState) {
        Transfer memory transfer = transfers[transferId];
        currentState = transfer.state;
    }

    function withdrawETH(address payable to) public {
        uint256 contractBalance = address(this).balance;

        (bool success, ) = to.call{value: contractBalance}('');

        require(success, 'Failed to send Balace');
    }
}
