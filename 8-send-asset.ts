import { SDK } from "codechain-sdk";
// import { H256 } from "codechain-primitives";

const platformAddress = "내 키";
const assetAddress = "내 새로운 어셋 키";
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

  const mintTracker = await mintAsset(sdk);
  const asset = await sdk.rpc.chain.getAsset(mintTracker, 0, 0);

  const transferTx = sdk.core.createTransferAssetTransaction()
    .addInputs(asset!)
    .addOutputs([
        {
            recipient: assetAddress,
            quantity: 500,
            assetType: asset!.assetType,
            shardId: 0
        },
        {
            recipient: assetAddress,
            quantity: 500,
            assetType: asset!.assetType,
            shardId: 0
        }
    ]);

    await sdk.key.signTransactionInput(transferTx, 0);
  
  const seq = await sdk.rpc.chain.getSeq(platformAddress);
  const signedTx = await sdk.key.signTransaction(transferTx, {
      account: platformAddress,
      fee: 1000,
      seq: seq
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

  throw new Error(
    `The transaction(${txHash.toString()}) is not mined after 30 seconds. Please check net network status or your mistake`
  );
}

main().catch(console.error);

async function mintAsset(sdk: SDK) {
  const assetScheme = sdk.core.createAssetScheme({
    shardId: 0,
    metadata: "My precious asset" + Math.random(),
    supply: 1000
  });

  const mintAssetTransaction = sdk.core.createMintAssetTransaction({
    scheme: assetScheme,
    recipient: assetAddress
  });

  const seq = await sdk.rpc.chain.getSeq(platformAddress);
  console.log(`seq ${seq}`);

  const signedTx = await sdk.key.signTransaction(mintAssetTransaction, {
    account: platformAddress,
    passphrase,
    fee: 100000,
    seq
  });

  const txHash = await sdk.rpc.chain.sendSignedTransaction(signedTx);
  console.log(`TxHash ${txHash}`);

  for (let index = 0; index < 30; index++) {
    const contained = await sdk.rpc.chain.containsTransaction(txHash);
    if (contained) {
      console.log(`Transaction ${txHash.toString()} is mined`);
      return mintAssetTransaction.tracker();
    }
    delay(1000);
  }

  throw new Error(
    `The transaction(${txHash.toString()}) is not mined after 30 seconds. Please check net network status or your mistake`
  );
}

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}