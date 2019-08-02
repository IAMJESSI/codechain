
import { SDK } from "codechain-sdk";



async function main() {

const sdk = new SDK({

    server: "https://corgi-rpc.codechain.io",

    networkId: "wc"

});



  const bestBlockID = await sdk.rpc.chain.getBestBlockId();

console.dir(bestBlockID);

}



main().catch(console.error);