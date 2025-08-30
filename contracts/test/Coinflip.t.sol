// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Coinflip} from "../src/Coinflip.sol";

contract CoinflipTest is Test {
    Coinflip public coinflip;

    function setUp() public {
        coinflip = new Coinflip(2);
    }
}
