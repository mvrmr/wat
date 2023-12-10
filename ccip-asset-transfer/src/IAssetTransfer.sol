// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAssetTransfer {
    struct Transfer {
        uint256 transferState;
        uint256 transferAmount;
        address receiver;
    }

    function requestTransfer(uint256 amount, address receiver) external;

    function lockAsset(uint256 transferId, uint256 transferState) external;

    // Add signatures for the other two functions as needed
}
