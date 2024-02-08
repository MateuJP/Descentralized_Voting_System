// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Token.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PollingStation is ReentrancyGuard {
    address private owner;
    address token_address;
    address [] public voters;
    MyToken token;
    uint256[] options;
    uint256 min_index;
    uint256 max_index;
    uint256 votation_id;
    uint256 public tokens_for_vote;
    uint256 public votingEndTime;
    mapping(address => bool) public has_voted;
    
    event newVote(uint256 id_votation, address indexed voter, uint256 option);

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier votingOpen() {
        require(block.timestamp <= votingEndTime && votingEndTime != 0, "Voting has ended");
        _;
    }

    constructor(address addr_token) {
        owner = msg.sender;
        token_address=addr_token;
        token = MyToken(addr_token);
        min_index = 1;
        max_index = 4;
        tokens_for_vote = 1*10**token.decimals();
        options = new uint256[](max_index);
    }

    function setVotation(uint256 _max_index, uint256 _endVotation,uint256 idVotation) public onlyOwner nonReentrant {
        max_index=_max_index;
        options=new uint256[](max_index);
        
        for(uint256 i=0;i<voters.length;i++){
            has_voted[voters[i]]=false;
        }
        votingEndTime = block.timestamp + (_endVotation * 1 minutes);
        delete voters;
        votation_id=idVotation;
    }

    function vote(uint256 option) public votingOpen nonReentrant {
        require(option >= min_index && option <= max_index, "Invalid option");
        require(!has_voted[msg.sender],"You just can vote once");
        require(token.allowance(msg.sender,address(this)) >= tokens_for_vote, "You don't have enough tokens");
        token.transferFrom(msg.sender,token_address,tokens_for_vote);
        options[option - min_index]++;
        voters.push(msg.sender);
        has_voted[msg.sender]=true;
        emit newVote(votation_id,msg.sender, option);
    }

    function getVotingEndTime() public view returns (uint256) {
        return votingEndTime;
    }
    function endVotation() public view returns(bool){
        return block.timestamp>votingEndTime;
    }
    function viewResults(uint256 option) public view returns (uint256){
        require(option>=min_index && option<=max_index,"Invalid Option");
        return options[option-min_index];

    }
    function returnAllOptions() public view returns(uint256[] memory){
        return options;
    }
    function setTokenForVote(uint256 value) public onlyOwner {
        tokens_for_vote=value*10**token.decimals();
    }
}
