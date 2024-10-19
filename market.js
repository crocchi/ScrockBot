const solanaWeb3 = require('@solana/web3.js');
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

const solUsdc = "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg";
const marketAddress = new solanaWeb3.PublicKey(solUsdc);

async function getMarketData() {
    // Ottieni l'account dei dati del mercato
    const accountInfo = await connection.getAccountInfo(marketAddress);
    if (accountInfo === null) {
        console.log("Nessun account trovato per l'indirizzo fornito.");
        return;
    }

    // Decodifica i dati dell'account
    const data = accountInfo.data;
    console.log("Dati grezzi del mercato:", data);
    
    // Decodifica i dati per ottenere il prezzo
    // Questo passo dipende dal formato specifico usato dal DEX (solitamente i dati sono compressi)
    // Sarà necessario conoscere il layout degli smart contract del DEX o usare una libreria di decodifica appropriata.
}

getMarketData();

