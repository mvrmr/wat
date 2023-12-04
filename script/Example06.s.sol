// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "./Helper.sol";
import {BasicMessageSender} from "../src/BasicMessageSender.sol";
import {BasicMessageReceiver} from "../src/BasicMessageReceiver.sol";
import {AssetTransfer} from "../src/AssetTransfer.sol";

contract AssetTransferDeployer is Script, Helper {
    function run(SupportedNetworks source) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        (address router, address link, , ) = getConfigFromNetwork(source);

        AssetTransfer assetTransfer = new AssetTransfer();

        console.log(
            "AssetTransfer contract deployed on ",
            networks[source],
            "with address: ",
            address(assetTransfer)
        );

        vm.stopBroadcast();
    }
}
