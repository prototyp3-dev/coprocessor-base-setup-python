// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Create2} from "openzeppelin-contracts/contracts/utils/Create2.sol";

import {MyContract} from "../src/MyContract.sol";

address constant DEPLOY_FACTORY = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

contract Deploy is Script {
    address constant DEPLOY_FACTORY =
        0x4e59b44847b379578588920cA78FbF26c0B4956C;
    bytes32 constant SALT = bytes32(0);
    address constant taskIssuerAddress =
        0x95401dc811bb5740090279Ba06cfA8fcF6113778;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        bytes32 machineHash = vm.envBytes32("MACHINE_HASH");

        vm.startBroadcast(deployerPrivateKey);

        console.logString("Deploying Contract");

        bytes memory contractCode = abi.encodePacked(
            type(MyContract).creationCode,
            abi.encode(
                taskIssuerAddress, // taskIssuerAddress
                machineHash // machineHash
            )
        );
        address contractAddress = Create2.computeAddress(
            SALT,
            keccak256(contractCode),
            DEPLOY_FACTORY
        );

        console.logString("Expected contractAddress");
        console.logAddress(contractAddress);
        if (checkSize(contractAddress) == 0) {
            MyContract myContract = new MyContract{salt: SALT}(
                taskIssuerAddress, // taskIssuerAddress
                machineHash // machineHash
            );
            console.logString("Deployed contractAddress");
            console.logAddress(address(myContract));
        } else {
            console.logString("Already deployed contractAddress");
        }

        vm.stopBroadcast();
    }

    function checkSize(address addr) public view returns (uint extSize) {
        assembly {
            extSize := extcodesize(addr) // returns 0 if EOA, >0 if smart contract
        }
    }
}
