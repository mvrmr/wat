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

contract DeployMaticContracts is Script, Helper {
    function run(
        SupportedNetworks source,
        SupportedNetworks destination
    ) external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);

        (address router, address link, , ) = getConfigFromNetwork(source);
        (, , , uint64 destinationChainId) = getConfigFromNetwork(destination);

        // WATMsgSender watMsgSender = new WATMsgSender(router, link);

        //        SenderVerifier senderVerifier = new SenderVerifier();
        //        ReceiverVerifier receiverVerifier = new ReceiverVerifier();
        // uint totalSupply = 7572068506142600455561021324247782031140542016923198543115047822296525074705;
        // AssetTransferV3 assetTransferMatic = new AssetTransferV3(
        //     totalSupply,
        //     address(0x61422aB7837a0C4da7438B1F852849669B713013),
        //     address(0xE900b9af638259fEE87dFB2d9a598f7690cbD8f0),
        //     address(watMsgSender),
        //     destinationChainId
        // );

        WATMsgReceiver watMsgReceiver = new WATMsgReceiver(
            router,
            address(0xb647eE38186fdab38D384EEcA087d50085182c34)
        );

        // console.log(
        //     'ALL contract deployed on ',
        //     networks[source],
        //     'with WATMsgSender: ',
        //     address(watMsgSender)
        // );
        // // console.log('SenderVerifier: ', address(senderVerifier));
        // // console.log('ReceiverVerifier: ', address(receiverVerifier));
        // console.log('AssetTransferMatic: ', address(assetTransferMatic));
        console.log('Receiver: ', address(watMsgReceiver));
        vm.stopBroadcast();
    }
}

contract DeployBnbContracts is Script, Helper {
    function run(
        SupportedNetworks source,
        SupportedNetworks destination
    ) external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);

        (address router, address link, , ) = getConfigFromNetwork(source);
        (, , , uint64 destinationChainId) = getConfigFromNetwork(destination);

        WATMsgSender watMsgSender = new WATMsgSender(router, link);
        // SenderVerifier senderVerifier = new SenderVerifier();
        // ReceiverVerifier receiverVerifier = new ReceiverVerifier();
        uint totalSupply = 7572068506142600455561021324247782031140542016923198543115047822296525074705;
        AssetTransferV3 assetTransferBnb = new AssetTransferV3(
            totalSupply,
            address(0xb9c34b7aE2C81eD0d7E3812CAbc8D8E07e8327C3),
            address(0x9d16A96e68BDc89DF311043211Cf410A240689BC),
            address(watMsgSender),
            destinationChainId
        );

        WATMsgReceiver watMsgReceiver = new WATMsgReceiver(
            router,
            address(assetTransferBnb)
        );

        console.log(
            'ALL contract deployed on ',
            networks[source],
            'with WATMsgSender: ',
            address(watMsgSender)
        );
        // console.log('SenderVerifier: ', address(senderVerifier));
        // console.log('ReceiverVerifier: ', address(receiverVerifier));
        console.log('AssetTransferMatic: ', address(assetTransferBnb));
        console.log('WATMsgReceiver: ', address(watMsgReceiver));

        vm.stopBroadcast();
    }
}

contract InitiateRequest is Script, Helper {
    function run(address assetMatic, address owner, address receiver) external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);

        uint transferAmount = 9063223437320598139079695905155378525850140857890492073786276750582370389075;
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

contract SendData is Script, Helper {
    function run(
        address watSender,
        SupportedNetworks destination,
        address receiver
    ) external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);
        bytes memory data = abi.encodeCall(
            AssetTransferV3.checkRec,
            (uint256(20))
        );
        (, , , uint64 destinationChainId) = getConfigFromNetwork(destination);

        bytes32 messageId = IWATMsgSender(watSender).send(
            destinationChainId,
            receiver,
            data
        );
        console.log('Message Id');
        console.logBytes32(messageId);
        vm.stopBroadcast();
    }
}

contract ReadData is Script, Helper {
    function run(address watMsgReceiver, address assetTransfer) external view {
        (
            bytes32 latestMessageId,
            uint64 latestSourceChainSelector,
            address latestSender,
            bool latestCallSuccess
        ) = WATMsgReceiver(watMsgReceiver).getLatestMessageDetails();
        uint256 latestNumber = AssetTransferV3(assetTransfer).latestNumber();

        console.log('Latest Message ID: ');
        console.logBytes32(latestMessageId);
        console.log('Latest Source Chain Selector: ');
        console.log(latestSourceChainSelector);
        console.log('Latest Sender: ');
        console.log(latestSender);
        console.log('Latest latestCallSuccess: ');
        console.log(latestCallSuccess);
        console.log('Latest number: ');
        console.log(latestNumber);
    }
}

contract AddRecAddress is Script, Helper {
    function run(address assetTransfer, address receiver) external {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);

        AssetTransferV3(assetTransfer).setWatReceiver(receiver);

        vm.stopBroadcast();
    }
}
