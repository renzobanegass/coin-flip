// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// import {VRFConsumerBaseV2} from "../lib/foundry-chainlink-toolkit/lib/chainlink-brownie-contracts/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Coinflip {


    uint256 public betAmount;
    uint8 public maxTeamsNum;

    mapping(uint8 => address[]) public teamPlayersMap;
    mapping(uint8 => uint256) public teamAmountMap;
    mapping(address => bool) public isPlaying;
    address[] public allPlayers;
    uint256 public balance;

    constructor(uint8 _maxTeamsNum) {
        maxTeamsNum = _maxTeamsNum;
        betAmount = 0.001 ether;
    }

    function joinRound(uint8 team) public payable {
        require(team <= maxTeamsNum, "Invalid team");
        require(!isPlaying[msg.sender], "Player already playing");
        require(msg.value == betAmount, "Invalid bet amount");

        teamPlayersMap[team].push(msg.sender);
        isPlaying[msg.sender] = true;
        teamAmountMap[team] += betAmount;
        balance += betAmount;
        allPlayers.push(msg.sender);
    }

    function resolveRound() public {
        require(balance > 0, "No balance to resolve");
        require(teamPlayersMap[1].length > 0 && teamPlayersMap[2].length > 0, "No players to resolve");

        uint8 randomNumber = uint8(block.number % 2);

        address[] memory winners = teamPlayersMap[randomNumber];
        uint256 winnersQuantity = winners.length;

        for (uint8 i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(winnersQuantity / (winnersQuantity + 1) * balance);
        }

        for(uint8 i = 0; i < maxTeamsNum; i++) {
            delete teamPlayersMap[i];
            delete teamAmountMap[i];
        }

        for(uint8 i = 0; i < allPlayers.length; i++) {
            isPlaying[allPlayers[i]] = false;
        }

        balance = 0;
        delete allPlayers;

    }
}
