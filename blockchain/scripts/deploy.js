const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ComplaintsLog contract...");

  const ComplaintsLog = await ethers.getContractFactory("ComplaintsLog");
  const complaintsLog = await ComplaintsLog.deploy();
  await complaintsLog.deploymentTransaction().wait();

  const contractAddress = complaintsLog.target;
  console.log("ComplaintsLog deployed to:", contractAddress);

  // Auto-update backend .env file
  const envPath = path.resolve(__dirname, "../../complaints-backend/src/.env");
  const envVar = "COMPLAINTS_LOG_CONTRACT_ADDRESS";

  try {
    let envContent = fs.readFileSync(envPath, "utf8");

    const regex = new RegExp(`^${envVar}=.*$`, "m");
    if (regex.test(envContent)) {
      // Replace existing line
      envContent = envContent.replace(regex, `${envVar}=${contractAddress}`);
    } else {
      // Append new line
      envContent += `\n${envVar}=${contractAddress}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log(` Updated ${envVar} in ${envPath}`);
  } catch (err) {
    console.error(" Failed to update .env file:", err.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
