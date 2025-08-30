// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Coinflip} from "../src/Coinflip.sol";

contract CounterScript is Script {
    function run() public {
        vm.startBroadcast();
        Coinflip coinflip = new Coinflip(5);
        vm.stopBroadcast();
    }
}
