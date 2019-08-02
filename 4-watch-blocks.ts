import { SDK } from "codechain-sdk";
import { Block } from "codechain-sdk/lib/core/Block";

async function main() {
const sdk = new SDK({
    server: "https://corgi-rpc.codechain.io",
    networkId: "wc"
});

let currentBestBlockNumber: number = await sdk.rpc.chain.getBestBlockNumber();

while (true) {
    const block: Block | null = await sdk.rpc.chain.getBlock(currentBestBlockNumber)
    console.log(`New block ${currentBestBlockNumber} - ${block!.hash}`);

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

async function delay(ms: number) {
    return new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, ms);
    });
}