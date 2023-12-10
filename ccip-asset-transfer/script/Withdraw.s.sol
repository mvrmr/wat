// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import 'forge-std/Script.sol';
import './Helper.sol';

import {AssetTransferV3} from '../src/AssetTransferV3.sol';
import {WATMsgSender} from '../src/WATMsgSender.sol';
import {WATMsgReceiver} from '../src/WATMsgReceiver.sol';
import {SenderVerifier} from '../src/verifiers/SenderVerifier.sol';
import {ReceiverVerifier} from '../src/verifiers/ReceiverVerifier.sol';

contract WithdrawMLink is Script, Helper {
    function run(address msgSender) external {
        //WA(msgSender).withdrawToken()
    }
}
