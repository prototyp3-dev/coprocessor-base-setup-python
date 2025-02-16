// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "coprocessor-base-contract/CoprocessorAdapter.sol";

abstract contract EvmCoprocessorAdapter is CoprocessorAdapter {
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

    function evmInput(address caller, bytes calldata payload) external {
        bytes memory input = abi.encodeWithSignature(
            "EvmAdvance(uint256,address,address,uint256,uint256,uint256,uint256,bytes)",
            block.chainid,
            this,
            caller,
            block.number,
            block.timestamp,
            block.prevrandao,
            0,
            payload
        );
        this.doCoprocessorCall(input);
    }

    function doCoprocessorCall(bytes calldata input) public {
        callCoprocessor(input);
    }
}
