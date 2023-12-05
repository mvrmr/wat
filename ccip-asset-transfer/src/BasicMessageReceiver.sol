// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Withdraw} from "./utils/Withdraw.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract BasicMessageReceiver is CCIPReceiver, Withdraw {
    bytes32 latestMessageId;
    uint64 latestSourceChainSelector;
    address latestSender;
    bytes latestMessage;
    bool latestCallSuccess;
    uint256 counter = 0;
    address private assetTransfer;

    event MessageReceived(
        bytes32 latestMessageId,
        uint64 latestSourceChainSelector,
        address latestSender,
        bytes latestMessage,
        bool callSuccess
    );

    constructor(address router, address _assetTransfer) CCIPReceiver(router) {
        assetTransfer = _assetTransfer;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        latestMessageId = message.messageId;
        latestSourceChainSelector = message.sourceChainSelector;
        latestSender = abi.decode(message.sender, (address));
        latestMessage = abi.decode(message.data, (bytes));

        (bool success, ) = address(assetTransfer).call(message.data);

        latestCallSuccess = success;
        emit MessageReceived(
            latestMessageId,
            latestSourceChainSelector,
            latestSender,
            latestMessage,
            success
        );
    }

    function receivedMessage() internal {
        counter++;
    }

    function viewCounter() public view returns (uint256) {
        return counter;
    }

    function getLatestMessageDetails()
        public
        view
        returns (bytes32, uint64, address, bytes memory, bool)
    {
        return (
            latestMessageId,
            latestSourceChainSelector,
            latestSender,
            latestMessage,
            latestCallSuccess
        );
    }
}
