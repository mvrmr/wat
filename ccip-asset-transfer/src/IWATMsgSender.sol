// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IWATMsgSender {
    /**
     * @notice Send a message to another chain
     * @param destinationChainSelector The chain selector for the destination chain
     * @param receiver The address of the receiver on the destination chain
     * @param messageData The message data to send
     * @return messageId The ID of the message that was sent
     */
    function send(
        uint64 destinationChainSelector,
        address receiver,
        bytes calldata messageData
    ) external returns (bytes32 messageId);

    /**
     * @notice Event emitted when a message is sent
     * @param messageId The ID of the message that was sent
     */
    event MessageSent(bytes32 messageId);
}
