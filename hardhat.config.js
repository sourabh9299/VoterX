/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.0",  // Ensure this matches your Voting.sol pragma version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    volta: {
      url: 'https://volta-rpc.energyweb.org', // Volta network RPC URL
      accounts: [`0x${PRIVATE_KEY}`] // Use your private key from .env file
    }
  }
};
