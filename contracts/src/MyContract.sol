// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./EvmCoprocessorAdapter.sol";

contract MyContract is EvmCoprocessorAdapter {
    event NoticeEvent(bytes32 payloadHash, string message);

    constructor(
        address _taskIssuerAddress,
        bytes32 _machineHash
    ) CoprocessorAdapter(_taskIssuerAddress, _machineHash) {}

    function runExecution(bytes calldata payload) external {
        this.evmInput(msg.sender, payload);
    }

    function handleNotice(
        bytes32 payloadHash,
        bytes memory notice
    ) internal override {
        (string memory message) = abi.decode(notice,(string));
        emit NoticeEvent(payloadHash, message);
    }
}
