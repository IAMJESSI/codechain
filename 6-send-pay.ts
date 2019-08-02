import { SDK } from "codechain-sdk";

const fromPlatformAddress = "wccqxny5xm0azgn8sdquhreua7wj6yv05d95g80m2x8";
const passphrase = "";

async function main() {
  const sdk = new SDK({
    server: "https://corgi-rpc.codechain.io",
    networkId: "wc",
    keyStoreType: {
      type: "local",
      path: "./keystore.db"
    }
  });

  const pay = sdk.core.createPayTransaction({
      recipient: "wccqxny5xm0azgn8sdquhreua7wj6yv05d95g80m2x8",
      quantity: 1000
  });

  const seq = await sdk.rpc.chain.getSeq(fromPlatformAddress);

  const signedTx = await sdk.key.signTransaction(pay, {
      account: fromPlatformAddress,
      fee: 100,
      seq
  });

  const txHash = await sdk.rpc.chain.sendSignedTransaction(signedTx);
  console.log(`TxHash ${txHash}`);

  for (let index = 0; index < 30; index++) {
    const contained = await sdk.rpc.chain.containsTransaction(txHash);
    if (contained) {
      console.log(`Transaction ${txHash.toString()} is mined`);
      return;
    }
    delay(1000);
  }

  console.log(
    `The transaction(${txHash.toString()}) is not mined after 30 seconds. Please check net network status or your mistake`
  );
}

main().catch(console.error);

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}