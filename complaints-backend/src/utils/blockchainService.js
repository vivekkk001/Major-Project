// src/utils/blockchainService.js
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
// Read contract ABI from the artifact file
const getContractABI = () => {
  try {
    const artifactPath = path.resolve(__dirname, "../../../blockchain/artifacts/contracts/ComplaintsLog.sol/ComplaintsLog.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    return artifact.abi;
  } catch (error) {
    console.error("Error loading contract ABI:", error);
    throw new Error("Failed to load contract ABI. Make sure the contract is compiled.");
  }
};

// Load environment variables
const contractAddress = process.env.COMPLAINTS_LOG_CONTRACT_ADDRESS;
const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://localhost:8545"; // Default to local node
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

// Initialize provider and contract
let provider, wallet, contract;

try {
  // Updated for ethers v6
  provider = new ethers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(privateKey, provider);
  contract = new ethers.Contract(contractAddress, getContractABI(), wallet);
  console.log("Blockchain service initialized successfully");
} catch (error) {
  console.error("Error initializing blockchain service:", error);
}

const blockchainService = {
  /**
   * Add a new complaint to the blockchain
   * @param {string} complaintId - The ID of the complaint
   * @returns {Promise<string>} - Transaction hash
   */
  async addComplaint(complaintId) {
    try {
      console.log(`Adding complaint ${complaintId} to blockchain...`);
      
      const tx = await contract.addComplaint(complaintId);
      const receipt = await tx.wait();
      
      console.log(`Complaint ${complaintId} added to blockchain. Tx hash: ${receipt.hash}`);
      return receipt.hash;
    } catch (error) {
      console.error(`Error adding complaint to blockchain: ${error.message}`);
      throw error;
    }
  },

  /**
   * Update the status of a complaint on the blockchain
   * @param {string} complaintId - The ID of the complaint
   * @param {string} newStatus - The new status to add
   * @returns {Promise<string>} - Transaction hash
   */
  async updateStatus(complaintId, newStatus) {
    try {
      console.log(`Updating status for complaint ${complaintId} to "${newStatus}"...`);
      
      const tx = await contract.updateStatus(complaintId, newStatus);
      const receipt = await tx.wait();
      
      console.log(`Status updated for complaint ${complaintId}. Tx hash: ${receipt.hash}`);
      return receipt.hash;
    } catch (error) {
      console.error(`Error updating status on blockchain: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get complaint details from the blockchain
   * @param {string} complaintId - The ID of the complaint
   * @returns {Promise<Object>} - Complaint data from blockchain
   */
  async getComplaint(complaintId) {
    try {
      console.log(`Fetching complaint ${complaintId} from blockchain...`);
      
      const result = await contract.getComplaint(complaintId);
      
      return {
        complaintId: result[0],
        timestamp: new Date(Number(result[1]) * 1000), // Convert from Unix timestamp
        statusUpdates: result[2]
      };
    } catch (error) {
      console.error(`Error fetching complaint from blockchain: ${error.message}`);
      throw error;
    }
  }
};

module.exports = blockchainService;