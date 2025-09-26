Contracts folder (Hardhat)
- contracts/PointsToken.sol : the token contract (decimals = 0)
- scripts/deploy.js : deploy script
- hardhat.config.js : hardhat config targeting Mumbai (configure .env)
Commands:
  npm install
  npx hardhat compile
  npx hardhat run scripts/deploy.js --network mumbai
