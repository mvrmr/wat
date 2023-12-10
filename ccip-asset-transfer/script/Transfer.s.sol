// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import 'forge-std/Script.sol';
import './Helper.sol';

import {AssetTransferV3} from '../src/AssetTransferV3.sol';
import {WATMsgSender} from '../src/WATMsgSender.sol';
import {WATMsgReceiver} from '../src/WATMsgReceiver.sol';
import {SenderVerifier} from '../src/verifiers/SenderVerifier.sol';
import {ReceiverVerifier} from '../src/verifiers/ReceiverVerifier.sol';
import {IWATMsgSender} from '../src/IWATMsgSender.sol';

contract InitiateRequest is Script, Helper {
    function run(
        address assetMatic,
        address owner,
        address receiver,
        uint transferAmount
    ) external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);

        uint[2] memory _pA = [
            uint(
                20477609174941154187356854671849235946378517577975955451934108673721901739285
            ),
            uint(
                6784509057939839054913595226476555619186750185541866049254406100074644167709
            )
        ];

        uint[2][2] memory _pB = [
            [
                uint(
                    20383133222437155449718759618515169711692260057214661039814095848008902815235
                ),
                uint(
                    6089865246105190676736684976410379135735964536661019790179433344690788774848
                )
            ],
            [
                uint(
                    1257425549973516426450204688100913198959754913149523294026238743046052954906
                ),
                uint(
                    12388298944050795792724533461192229726788578786260493289549440914212372672407
                )
            ]
        ];

        uint[2] memory _pC = [
            uint(
                13686779981378451443698536652415982512327768039197691882923464915324136921521
            ),
            uint(
                15362278040140921024726399565638960853807811417047636744886597418309574637748
            )
        ];

        AssetTransferV3(assetMatic).requestAssetTransfer(
            receiver,
            owner,
            transferAmount,
            _pA,
            _pB,
            _pC
        );

        bytes32 latestMessageId = AssetTransferV3(assetMatic).latestmessage();

        console.log('latest msg: ');
        console.logBytes32(latestMessageId);

        vm.stopBroadcast();
    }
}

contract LockAsset is Script, Helper {}

contract MintAsset is Script, Helper {}

contract BurnAsset is Script, Helper {}
