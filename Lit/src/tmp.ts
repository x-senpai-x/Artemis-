import {
  LitNodeClient,
  encryptString,
  decryptToString,
  verifyJwt,
} from "@lit-protocol/lit-node-client";
const crypto_1 = require("@lit-protocol/crypto");
const uint8arrays_1 = require("@lit-protocol/uint8arrays");
import { LitNetwork } from "@lit-protocol/constants";
import {
  LitPKPResource,
  LitActionResource,
  generateAuthSig,
  createSiweMessageWithRecaps,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";
import { LitAbility } from "@lit-protocol/types";
import { AuthCallbackParams } from "@lit-protocol/types";
import { ethers } from "ethers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LIT_CHAIN_RPC_URL, LIT_CHAINS } from "@lit-protocol/constants";
import { verifyEthSig } from "./utils/verifyeth";

const crypto = require("crypto");

require("dotenv").config();

(async () => {
  console.log("🔥 LET'S GO!");
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    debug: false,
  });

  await litNodeClient.connect();

  console.log("Connected nodes:", litNodeClient.connectedNodes);

  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    new ethers.providers.JsonRpcProvider(LIT_CHAIN_RPC_URL)
  );

  const latestBlockhash = await litNodeClient.getLatestBlockhash();

  const sessionSigs = await litNodeClient.getSessionSigs({
    resourceAbilityRequests: [
      {
        resource: new LitPKPResource("*"),
        ability: LitAbility.PKPSigning,
      },
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback: async (params: AuthCallbackParams) => {
      if (!params.uri) {
        throw new Error("uri is required");
      }
      if (!params.expiration) {
        throw new Error("expiration is required");
      }

      if (!params.resourceAbilityRequests) {
        throw new Error("resourceAbilityRequests is required");
      }

      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: wallet.address,
        nonce: latestBlockhash,
        litNodeClient,
      });

      const authSig = await generateAuthSig({
        signer: wallet,
        toSign,
      });

      return authSig;
    },
  });

  console.log("✅ got sessionSigs:");

  let pkp = {
    publicKey: process.env.PKPPUBLIC_KEY!,
  };

  // -- executeJs
  const executeJsRes = await litNodeClient.executeJs({
    code: `(async () => {
      const sigShare = await LitActions.signEcdsa({
        toSign: dataToSign,
        publicKey,
        sigName: "sig",
      });
      LitActions.setResponse({
        response: JSON.stringify({ timestamp: Date.now().toString()}),
      });
    })();`,
    sessionSigs,
    jsParams: {
      dataToSign: ethers.utils.arrayify(
        ethers.utils.keccak256([1, 2, 3, 4, 5, 6])
      ),
      publicKey: pkp.publicKey,
    },
  });

  console.log("✅ executeJsRes:", executeJsRes);
  console.log("executeJsRes done");
  console.log("netork public key:", litNodeClient.networkPubKey);

  // console.log("dataSigned:",executeJsRes.signatures.sig.dataSigned);
  // console.log("signature:",executeJsRes.signatures.sig.signature);

  crypto_1.verifySignature(
    pkp.publicKey,
    uint8arrays_1.uint8arrayFromString(executeJsRes.signatures.sig.dataSigned),
    uint8arrays_1.uint8arrayFromString(executeJsRes.signatures.sig.signature)
  );
})();
