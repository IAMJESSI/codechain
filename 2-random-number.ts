import { SDK } from "codechain-sdk";

async function main() {
const sdk = new SDK({
    server: "https://corgi-rpc.codechain.io",
    networkId: "wc"
});

const blockID = await sdk.rpc.chain.getBestBlockId();
console.log(blockID);
const hashWithout0x = blockID.hash.toString().slice(2);
const buffer = Buffer.from(hashWithout0x, "hex");
const randomNumber = buffer.readUInt32LE(0);

console.log(`Random number is ${randomNumber}`);
}

main().catch(console.error);