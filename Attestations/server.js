const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { EAS, NO_EXPIRATION, SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC);
const eas = new EAS(EASContractAddress);
eas.connect(provider);

const schemaUID = process.env.SCHEMA_UID;

async function createAttestation(agentId, attestations, portfolio, recipient) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    eas.connect(wallet);

    const schemaEncoder = new SchemaEncoder("string AgentId, uint8 NumberOfAttestations, uint64 TotalPortfolioHolding");
    const encodedData = schemaEncoder.encodeData([
      { name: "AgentId", value: agentId, type: "string" },
      { name: "NumberOfAttestations", value: attestations, type: "uint8" },
      { name: "TotalPortfolioHolding", value: portfolio, type: "uint64" },
    ]);

    const transaction = await eas.attest({
      schema: schemaUID,
      data: {
        recipient,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        data: encodedData,
      },
    });

    const attestationUID = await transaction.wait();
    return { attestationUID, receipt: transaction.receipt };
  } catch (error) {
    throw new Error(`Failed to create attestation: ${error.message}`);
  }
}

app.post("/create-attestation", async (req, res) => {
  const { agentId, attestations, portfolio, recipient } = req.body;

  try {
    const result = await createAttestation(agentId, attestations, portfolio, recipient);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

