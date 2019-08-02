import { SDK } from "codechain-sdk";

async function main() {
const sdk = new SDK({
    server: "https://corgi-rpc.codechain.io",
    networkId: "wc"
});

const address = process.argv[2];
const balance = await sdk.rpc.chain.getBalance(address);
console.log(balance.toString());
}

main().catch(console.error);