Web3 Points Project (Complete package)
Structure:
- contracts_project/   => Hardhat project (contract + deploy)
- backend-rust/        => Rust backend (Actix-web + ethers-rs)
- frontend/            => React + Vite + Tailwind frontend

Steps (summary):
1) Setup contracts_project: npm install, set .env (MUMBAI_RPC_URL, DEPLOYER_PRIVATE_KEY), npx hardhat compile, npx hardhat run scripts/deploy.js --network mumbai
2) Copy artifacts/contracts/PointsToken.sol/PointsToken.json into backend-rust/abi and frontend/src/abi
3) Configure backend-rust/.env with MUMBAI_RPC_URL, DEPLOYER_PRIVATE_KEY, CONTRACT_ADDRESS and run: cargo run
4) Configure frontend/.env VITE_CONTRACT_ADDRESS and run: npm run dev
