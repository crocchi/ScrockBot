const solanaWeb3 = require('@solana/web3.js');
//const { Market } = require('@project-serum/serum');
const Phoenix = require('@ellipsis-labs/phoenix-sdk');
const BN = require('bn.js');

// URL del nodo Solana RPC con supporto WebSocket
const solanaNodeWebSocket = 'wss://api.mainnet-beta.solana.com';
const solanaChainstack='https://solana-mainnet.core.chainstack.com/78996579e71535c10dbc3474cf8eea38'
// Inizio del timer
console.time('timeNodeConnect');

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'),{wsEndpoint:solanaNodeWebSocket})

console.log('connessa al nodo..');
console.timeEnd('timeNodeConnect');

const solUsdc = "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg";
const phoenixP= "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY";
//const programId = new solanaWeb3.PublicKey('9xQeWvG816bUx9EPm2CZzprPMPPw2WVWzGTUnMtaeF9w'); // Indirizzo del programma Serum v3
// Indirizzo del mercato SOL/USDC su Phoenix
//const marketAddress = new solanaWeb3.PublicKey('4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg');

console.time('executionTimer');
// Indirizzo del programma Phoenix
const programId = new solanaWeb3.PublicKey('PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY');
const programAddress = new solanaWeb3.PublicKey(phoenixP);
const marketAddress = new solanaWeb3.PublicKey(solUsdc);


// Funzione per cercare tramite il nome del mercato
function findMarketByName(name,marketConfigs) {
    for (const [key, value] of marketConfigs) {
        if (value.name === name) {
            return value;
        }
    }
    return null; // Restituisce null se non viene trovato il mercato
}
// Funzione per cercare tramite il contratto id

const findMarket = async (id,data) =>{

    if (data.has(id)) {
        const foundMarket = await data.get(id);
        //console.log('Market trovato:', foundMarket);
        return foundMarket.data
    } else {
        console.log('Market non trovato');
    }
}
// Funzione per convertire la stringa <BN: ...> in numero o stringa

function convertBN(bnString) {
    
    // Crea un oggetto BN usando il valore esadecimale
    const bn = new BN(bnString, 16);
    
    // Se il numero è troppo grande, restituisci una stringa, altrimenti un numero
    return bn.bitLength() > 53 ? bn.toString() : bn.toNumber();
}

async function getMarketData() {
    // Ottieni l'account dei dati del mercato
   /*
    const market = await Market.load(connection, marketAddress , {},programId);
    const bids = await market.loadBids(connection);
    const asks = await market.loadAsks(connection);

    // Visualizza i migliori ordini di acquisto e vendita
    for (let order of asks) {
        console.log('Ask Price:', order.price, 'Size:', order.size);
    }
    
    for (let order of bids) {
        console.log('Bid Price:', order.price, 'Size:', order.size);
    }
   
  console.time('manualExec')
    const accountInfo = await connection.getAccountInfo(marketAddress);
    //
    const buffer = Buffer.from(accountInfo.data); // Dati grezzi dell'account
const price = buffer.readBigUInt64LE(0);  // Esempio: prezzo memorizzato nei primi 8 byte
const quantity = buffer.readBigUInt64LE(8);  // Esempio: quantità memorizzata successivamente
console.log(price,quantity)
    if (accountInfo === null) {
        console.log("Nessun account trovato per l'indirizzo fornito.");
        return;
    }

    // Decodifica i dati dell'account
    const data = accountInfo.data;
    console.log("Dati grezzi del mercato:", data);
    console.timeEnd('manualExec')
     */
      // Create a Phoenix client and select a market
  const phoenix = await Phoenix.Client.create(connection);

  //const marketConfig = phoenix.marketConfigs.find((market) => market.name === "SOL/USDC");
  //console.log(phoenix)
  //console.log(phoenix.marketStates)
  for (const [marketAddress, market] of phoenix.marketConfigs) {

       console.log(` ${market.name} `);
       const tmpData=await findMarketByName(market.name, phoenix.marketConfigs) // marketId
       //console.log(tmpData);
       const priceData=await findMarket(tmpData.marketId , phoenix.marketStates)
       //const priceData=findMarketById(tmpData.marketId, phoenix.marketStates)
       console.log((convertBN(priceData.bids[0][0].priceInTicks.toString(16))))
       //const marketStateTwo = phoenix.marketStates.get(tmpData.marketId);
       //console.log(convertBN(marketStateTwo.data.bids[0][0].priceInTicks.toString(16))*0.001);

    if (market.name === "SOL/USDC") {
      console.log("SOL/USDC marketAddress: ", marketAddress);
      //console.log("MarketId ", market.marketId);
      console.log(market)
      console.time('processData');
      const marketState = phoenix.marketStates.get(marketAddress);

      let price=(convertBN(marketState.data.bids[0][0].priceInTicks.toString(16)))*0.001;
      console.log('Prezzo:',price)
      //console.log(marketState.data.bids[0])
      for (let bid of marketState.data.bids) {
        let prcTmp=(convertBN(bid[0].priceInTicks.toString(16)))*0.001;
        if(prcTmp < 160.000){continue}
      console.log(`
        priceInTicks: $${prcTmp} - numBaseLots(amountSol):SOL ${convertBN(bid[1].numBaseLots.toString(16))*0.001}  traderIndex:${convertBN(bid[1].traderIndex.toString(16))} 
        USDC: ${(convertBN(bid[1].numBaseLots.toString(16))*0.001)*prcTmp}
        `);
    }
    //orderSequenceNumber: ${convertBN(bid[0].orderSequenceNumber.toString(16))}
    /*  {
    priceInTicks: <BN: 29468>,
    orderSequenceNumber: <BN: ffffffffb0cd3b9d>
  },
  {
    traderIndex: <BN: 4>,
    numBaseLots: <BN: 14cb>,
    lastValidSlot: <BN: 0>,
    lastValidUnixTimestampInSeconds: <BN: 671909b5>

  } */
 //monitorare prezzo coppia
    let lastLadder= Phoenix.UiLadder | null;
    
    //console.log(lastLadder,ladder)
    let updates = 0;
    while (updates < 2) {
      let ladder = phoenix.getUiLadder(marketAddress);
      if (JSON.stringify(ladder) !== JSON.stringify(lastLadder)) {
        //console.clear();
        console.log("Ladder update", updates + 1, "of", 10, "\n");
        phoenix.printLadder(marketAddress);
        lastLadder = ladder;
        updates++;
      }//else break
     await phoenix.refreshMarket(marketAddress);
     await new Promise((res) => setTimeout(res, 1000));
     console.log('yo')
    }

    console.timeEnd('processData');
      //console.log(marketState.data.bids[1][0].priceInTicks.toString(16))
      //console.log(marketState.data.bids[1])
      console.timeEnd('executionTimer');

      console.time('refreshMarket');
      await phoenix.refreshMarket(marketAddress);
      const marketStatee = phoenix.marketStates.get(marketAddress);
      //console.log(marketStatee.data.bids[1]);
      // Esempi di valori che hai menzionato
      
      //console.log(marketStatee.data.bids[2])
      console.timeEnd('refreshMarket');
    }
      }
    // Decodifica i dati per ottenere il prezzo
    // Questo passo dipende dal formato specifico usato dal DEX (solitamente i dati sono compressi)
    // Sarà necessario conoscere il layout degli smart contract del DEX o usare una libreria di decodifica appropriata.
}

getMarketData();
// Fine del timer e output del tempo impiegato


//    await phoenix.refreshMarket(marketAddress);

// mantieni in ascolto su una stransazione 

/* const marketConfig = Array.from(phoenix.marketConfigs.values()).find(
    (market) => market.name === "SOL/USDC"
  );

  if (!marketConfig) throw new Error("Market not found");

  const marketAddress = marketConfig.marketId;

  let lastLadder: Phoenix.UiLadder | null = null;
  let updates = 0;
  while (updates < 10) {
    const ladder = phoenix.getUiLadder(marketAddress);
    if (JSON.stringify(ladder) !== JSON.stringify(lastLadder)) {
      console.clear();
      console.log("Ladder update", updates + 1, "of", 10, "\n");
      phoenix.printLadder(marketAddress);
      lastLadder = ladder;
      updates++;
    }

    await phoenix.refreshMarket(marketAddress); */
