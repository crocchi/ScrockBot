const web3 = require('@solana/web3.js');
const Phoenix = require('@ellipsis-labs/phoenix-sdk');
const bs58 = require("bs58");


// URL del nodo Solana RPC con supporto WebSocket
const solanaNodeWebSocket = 'wss://api.mainnet-beta.solana.com';

// Crea una connessione WebSocket
const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'),{wsEndpoint:solanaNodeWebSocket})


const contract="4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg";
// Funzione per monitorare il bilancio di un indirizzo
const publicKey = new web3.PublicKey(contract);

// Crea una connessione WebSocket
//const connection = new web3.Connection(solanaNodeWebSocket, 'confirmed');
//console.log(Phoenix.deserializeMarketData)
//deserializeMarketData  - decodePhoenixEvents
const subscriptionId = connection.onAccountChange(
    publicKey,
    (updatedAccountInfo) =>{
        console.log(`---Event Notification for ${publicKey.toString()}--- \nNew Account Balance:`, updatedAccountInfo);
       // console.log(Phoenix.deserializeMarketData(updatedAccountInfo.data))
       const decoded = bs58.decode(updatedAccountInfo.data.toString());

       const instructionEnum = decoded[0];
       console.log(instructionEnum)
    },
    "confirmed"
);
console.log('Starting web socket, subscription ID: ', subscriptionId);
//console.log(Phoenix)
//decodeInstructionData
console.log('Connessione WebSocket stabilita!');
