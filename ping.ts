import { SDK } from "codechain-sdk";

async function main() {
  const sdk = new SDK({
    server: "https://corgi-rpc.codechain.io",
    networkId: "wc"
  });

  const pong = await sdk.rpc.node.ping();
  console.log(pong);
}

main().catch(console.error);
