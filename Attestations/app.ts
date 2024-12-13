import dotenv from "dotenv";
import { EAS, NO_EXPIRATION, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";


dotenv.config();

const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS as string;
const privateKey = process.env.PRIVATE_KEY as string;
const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC);
const schemaUID = process.env.SCHEMA_UID as string;

const eas = new EAS(EASContractAddress);
eas.connect(provider);

async function createAttestation(agentId: string, attestations: number, portfolio: number, recipient: string) {
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

    const newAttestationUID = await transaction.wait();
    return { attestationUID: newAttestationUID, receipt: transaction.receipt };
  } catch (error) {
    console.error("Error creating attestation:", error);
    throw error;
  }
}

export default createAttestation;
