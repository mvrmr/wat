// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract AssetTransfer {
    struct Transfer {
        uint256 transferState;
        uint256 transferAmount;
        address receiver;
    }

    mapping(uint256 => Transfer) public transfers;
    uint256 public nextTransferId;

    event TransferRequested(
        uint256 indexed transferId,
        uint256 amount,
        address receiver
    );
    event AssetLocked(uint256 indexed transferId, uint256 transferState);

    // Request a transfer
    function requestTransfer(uint256 amount, address receiver) public {
        require(amount > 0, "Amount must be greater than 0");
        require(receiver != address(0), "Receiver address cannot be zero");

        uint256 transferId = nextTransferId++;
        transfers[transferId] = Transfer(0, amount, receiver);

        emit TransferRequested(transferId, amount, receiver);
    }

    // Lock assets for a transfer
    function lockAsset(uint256 transferId, uint256 transferState) public {
        require(
            transfers[transferId].transferAmount > 0,
            "Transfer does not exist"
        );
        require(
            transfers[transferId].transferState == 0,
            "Transfer already locked or completed"
        );

        transfers[transferId].transferState = transferState;

        emit AssetLocked(transferId, transferState);
    }

    function viewTransferState(
        uint256 transferId
    ) public view returns (uint256) {
        return transfers[transferId].transferState;
    }

    // Two more functions can be added here as per your requirements
}
