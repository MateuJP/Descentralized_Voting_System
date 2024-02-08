const {ethers}= require("hardhat");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/a65fad5a367043fdb9f43345642f30de`)
const tokenAbi=require("../../frontend/contractsData/MyToken.json");
const tokenAddress=require("../../frontend/contractsData/MyToken-address.json");

const {PRIVATE_KEY} = process.env;
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

const contract=new ethers.Contract(tokenAddress.address,tokenAbi.abi,provider);
const main=async()=>{
    const contract_wallet=contract.connect(wallet);
    await contract_wallet.removeMatic();
}

main();