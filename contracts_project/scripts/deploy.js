async function main() {
  const PointsToken = await ethers.getContractFactory("PointsToken");
  const signer = await ethers.provider.getSigner();
  const contract = await PointsToken.deploy(await signer.getAddress());
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ PointsToken desplegado en:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
