require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Private key from your .env file
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28", // Updated to match your contract's pragma
  networks: {
    // Hardhat's built-in local network
    hardhat: {},
    
    // Ganache local network
    ganache: {
      url: "http://127.0.0.1:7545", // Default Ganache port
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    }
  }
};