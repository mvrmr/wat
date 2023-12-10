// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {CCIPReceiver} from '@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol';
import {Client} from '@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol';
import './AssetTransferV3.sol';

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract WATMsgReceiver is CCIPReceiver {
    bytes32 latestMessageId;
    uint64 latestSourceChainSelector;
    address latestSender;
    bool latestCallSuccess;
    uint256 counter = 0;

    address private assetTransfer;

    event MessageReceived(
        bytes32 latestMessageId,
        uint64 latestSourceChainSelector,
        address latestSender,
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

        (bool success, ) = address(assetTransfer).call(message.data);

        emit MessageReceived(
            latestMessageId,
            latestSourceChainSelector,
            latestSender,
            success
        );
    }

    function getLatestMessageDetails()
        public
        view
        returns (bytes32, uint64, address, bool)
    {
        return (
            latestMessageId,
            latestSourceChainSelector,
            latestSender,
            latestCallSuccess
        );
    }
}
