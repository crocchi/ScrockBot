const solanaWeb3 = require('@solana/web3.js');
const { Market } = require('@project-serum/serum');

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

const solUsdc = "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg";
const marketAddress = new solanaWeb3.PublicKey(solUsdc);

async function getMarketData() {
    // Ottieni l'account dei dati del mercato
    const market = await Market.load(connection, marketPublicKey, {}, solanaWeb3.PublicKey.default);
    const bids = await market.loadBids(connection);
    const asks = await market.loadAsks(connection);

    // Visualizza i migliori ordini di acquisto e vendita
    for (let order of asks) {
        console.log('Ask Price:', order.price, 'Size:', order.size);
    }
    
    for (let order of bids) {
        console.log('Bid Price:', order.price, 'Size:', order.size);
    }
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

