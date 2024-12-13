import { litSignOrder } from "./litaction";
import { getGitZipLink } from "./utils/gitlink";
var fs = require("fs");

export async function signOrder(repo: string, branch: string = "main") {
  const [url, name] = getGitZipLink(repo, branch);

  const response = await litSignOrder(url);

  console.log("response:", response);

  const resp = await fetch(url).then((response) => response);
  const respArrayBuffer = await resp.arrayBuffer();
  const repoCommit = new Uint8Array(
    await crypto.subtle.digest("SHA-256", respArrayBuffer)
  );

  const base64BufferArray = Buffer.from(respArrayBuffer).toString("base64");
  console.log("repoCommit:", repoCommit);

  //@ts-ignore
  response.signatures.timestamp = response.response.valueOf()["timestamp"];
  response.signatures.repoUrl = url;

  return { signature: response.signatures, bufferArray: base64BufferArray };
}

export default signOrder;