// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./EvmCoprocessorAdapter.sol";

contract MyContract is EvmCoprocessorAdapter {
    constructor(
        address _taskIssuerAddress,
        bytes32 _machineHash
    ) CoprocessorAdapter(_taskIssuerAddress, _machineHash) {}

    //    EvmAdvance(
    //        uint256 chainId,
    //        address appContract,
    //        address msgSender,
    //        uint256 blockNumber,
    //        uint256 blockTimestamp,
    //        uint256 prevRandao,
    //        uint256 index,
    //        bytes calldata payload
    //    )

    function runExecution(bytes calldata payload) external {
        this.evmInput(payload);
    }

    uint256 public number;

    // class ChallengeNotice(BaseModel):
    //     challenge_id: abi.Bytes32
    //     user: abi.Address
    //     timestamp: abi.UInt
    //     score: abi.UInt
    //     escaped: abi.Bool
    //     n_treasures: abi.UInt
    //     n_moves: abi.UInt
    //     n_moves_left: abi.UInt

    function handleNotice(
        bytes32 payloadHash,
        bytes memory notice
    ) internal override {
        // Add logic for handling callback from co-processor containing notices.
        (bytes32 ch_id, address user, uint ts, , bool escaped, , , ) = abi
            .decode(
                notice,
                (bytes32, address, uint, uint, bool, uint, uint, uint)
            );
        number++;
    }
}
