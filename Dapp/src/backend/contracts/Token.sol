// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken is ERC20,ReentrancyGuard {
    
    uint256 public  price;
    address public owner;
    mapping(address => bool) public is_sub;

    event PurchaseTokens(address indexed sub, uint256 value);
    event ReturnTokens(address indexed sub, uint256 value);
    event NewAward(address indexed sub,uint256 value);

    modifier onlyOwner {
        require(msg.sender == owner,"You are not the owner");
        _;
    }

    constructor(uint256 _price) ERC20("CryptoCoderMatt", "CCM") {
        owner = msg.sender;
        _mint(address(this), 1_000_001*10**18 );

        is_sub[address(this)]=true;
        price=_price;
        emit Transfer(address(0), owner, totalSupply());
    }

    function transfer(address to, uint256 tokens) public override returns (bool success) {
        require(is_sub[msg.sender],"Sender needs to be sub");
        require(to != address(0), "ERC20: transfer from the zero address");
        require(balanceOf(msg.sender) >= tokens, "ERC20: transfer amount exceeds balance");
    
        _transfer(msg.sender, to, tokens);
        if(!is_sub[to]){
            is_sub[to]=true;
        }

        return true;
    }

     function approve(address spender,uint256 value) public override returns (bool success){
        require(is_sub[spender],"Spender needs to be a sub");
        require(spender != address(0), "ERC20: transfer from the zero address");
        require(balanceOf(msg.sender)>=value);
        _approve(msg.sender,spender,value);
        return true;
    }

    function transferFrom(address from,address to, uint256 value) public override returns(bool success){
        address spender=msg.sender;
        _spendAllowance(from,spender,value);
        _transfer(from,to,value);
        if(!is_sub[to]){
            is_sub[to]=true;
        }
        return true;
    }
    
    function createToken(uint256 value) public onlyOwner{
        _mint(owner,value);
    }
    function mintTokenFromSub(address sub,uint256 val) public onlyOwner {
        require(is_sub[sub],"Address is not from a sub");
        _mint(sub,val);
    }
    function addSub(address newSub) public onlyOwner {
        is_sub[newSub]=true;
    }
 
    function getBlanceContract() public view returns(uint256){
        return balanceOf(address(this));
    }

    function getBalanceContractMatic() public view returns (uint256){
        return address(this).balance;
    }

    function getCirculationTokens() public view returns(uint256){
        return totalSupply()-balanceOf(address(this));
    }

    function removeMatic() public onlyOwner nonReentrant {
        uint256 total_balance=address(this).balance;
        uint256 total_return=(getCirculationTokens() *price) /10**18;
        uint256 total_for_remove=total_balance-total_return;
        require (total_for_remove>0, "There's not enough Matic");
        payable(owner).transfer(total_for_remove);
    }

       
    function buyToken(uint256 amount) public payable nonReentrant {
        require(getBlanceContract()>=amount,"Shop don't have enough tokens");
        uint256 total_price = (amount*price)/10**18;
        require(msg.value>=total_price,"Money you are sending is not enough");
       _transfer(address(this),msg.sender,amount);
        uint256 return_value=msg.value-total_price;
        if(return_value>0){
            payable(msg.sender).transfer(return_value);
        }
        if(!is_sub[msg.sender]){
           is_sub[msg.sender]=true;
        }
        emit PurchaseTokens(msg.sender,amount);
    }

    function returnToken(uint256 amount) public nonReentrant {
        require(balanceOf(msg.sender)>=amount,"You don't have enough Tokens");
        uint256 total_matic = (amount*price)/10**18;
        require(getBalanceContractMatic()>=total_matic, "Smart contract don't have enough money");
        _transfer(msg.sender,address(this),amount);
        payable(msg.sender).transfer(total_matic);
        emit ReturnTokens(msg.sender,amount);
    }

}
