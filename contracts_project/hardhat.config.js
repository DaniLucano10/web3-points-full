require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.30",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "", // se asegura que siempre sea string
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`]
        : [],
      chainId: 80002,
    },
  },
};
