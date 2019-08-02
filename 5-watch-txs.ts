import { SDK } from "codechain-sdk";
import { MintAssetActionJSON } from "codechain-sdk/lib/core/transaction/MintAsset";
import { PayActionJSON } from "codechain-sdk/lib/core/transaction/Pay";
import { TransferAssetActionJSON } from "codechain-sdk/lib/core/transaction/TransferAsset";
import { SignedTransaction } from "codechain-sdk/lib/core/classes";

async function main() {
    const sdk = new SDK({
    server: "https://corgi-rpc.codechain.io",
    networkId: "wc"
    });

    let currentBestBlockNumber = await sdk.rpc.chain.getBestBlockNumber();

    while (true) {
    const block = await sdk.rpc.chain.getBlock(currentBestBlockNumber);
    console.log(`Watch block ${currentBestBlockNumber}`);
    for (const transaction of block!.transactions) {
        printTransaction(transaction);
    }
    await delay(100);

    let nextBlockNumber = await sdk.rpc.chain.getBestBlockNumber();
    while (nextBlockNumber === currentBestBlockNumber) {
        await delay(1000);
        nextBlockNumber = await sdk.rpc.chain.getBestBlockNumber();
    }

    currentBestBlockNumber = nextBlockNumber;
    }
}

main().catch(console.error);

function printTransaction(transaction: SignedTransaction) {
    console.log(transaction.unsigned.type());
    switch (transaction.unsigned.type()) {
    case "transferAsset":
        const transfer = transaction.toJSON().action as TransferAssetActionJSON;;
        console.group("Transfer");
        for (const input of transfer.inputs) {
            const prevOut = input.prevOut;
            console.log(`Input ${prevOut.quantity} ${prevOut.assetType}`);
        }
        for (const output of transfer.outputs) {
            console.log(`Output ${output.quantity} ${output.assetType}`);
        }
        console.groupEnd();
        break;
    case "pay":
        const pay: PayActionJSON = transaction.toJSON().action as PayActionJSON;
        console.log(`Pay ${pay.quantity} CCC to ${pay.receiver}`);
        break;
    case "mintAsset":
        const mintAsset = transaction.toJSON().action as MintAssetActionJSON;
        console.log(`MintAsset ${mintAsset.metadata}`);
        break;
    }
}

async function delay(ms: number) {
    return new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, ms);
    });
}