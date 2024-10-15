const { Connection, clusterApiUrl, PublicKey} = require('@solana/web3.js');


// Connessione a un nodo Solana (puoi scegliere devnet, testnet o mainnet-beta)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let currentSlot;

const getBlock = async ()=>{
    currentSlot = await connection.getSlot();
    console.log('BlockNumber: '+currentSlot);
}

// get a specific transaction (allowing for v0 transactions)
const getTx = async (tx)=> {
const txx = await connection.getTransaction( tx, { maxSupportedTransactionVersion: 0 } );
return txx
}

const tryMe = async ()=>{
    currentSlot=currentSlot+1;
    console.log(currentSlot);
    const transactions = await connection.getBlock(currentSlot, {
  maxSupportedTransactionVersion: 0
})//connection.getConfirmedBlock(currentSlot);
    
    // Se ci sono transazioni nel blocco
    if (transactions && transactions.transactions.length > 0) { 
            console.log(`\nNew transactions in slot ${currentSlot}:`);
            console.log(`\nTotal trans: ${transactions.transactions.length}:`);
        //console.log(transactions);
        //console.log(transactions.transactions);
         // Itera sulle transazioni trovate
        
              transactions.transactions.forEach((tx) => {
                      console.log(`- Transaction Signature: ${tx.transaction.signatures[0]}`);
                    // Puoi aggiungere ulteriori dettagli come account coinvolti, istruzioni, ecc.
                  console.log(`  Involved Accounts:`, tx.transaction.message.accountKeys.map(key => key.toBase58()));
                 // let tmpTx= await getTx(tx.transaction.signatures[0])
                  //console.log()
                        });

            
   }
}
setInterval(tryMe,60000)

//leggi il blocco corrente della rete
getBlock();

//tryMe()
/*
// Funzione per monitorare le transazioni
async function monitorTransactions() {
    console.log("Monitoring recent transactions on Solana...");

    // Ottieni lo slot corrente (utilizzato per tenere traccia della blockchain)
    let currentSlot = await Connection.getSlot();

    // Funzione per recuperare e visualizzare nuove transazioni
    setInterval(async () => {
        try {
            // Ottieni il numero di slot più recente
            const newSlot = await Connection.getSlot();

            if (newSlot > currentSlot) {
                console.log(`Checking transactions from slot ${currentSlot + 1} to ${newSlot}...`);

                for (let slot = currentSlot + 1; slot <= newSlot; slot++) {
                    // Recupera le transazioni confermate in un dato slot
                    const transactions = await Connection.getConfirmedBlock(slot);

                    // Se ci sono transazioni nel blocco
                    if (transactions && transactions.transactions.length > 0) {
                        console.log(`\nNew transactions in slot ${slot}:`);

                        // Itera sulle transazioni trovate
                        transactions.transactions.forEach((tx) => {
                            console.log(`- Transaction Signature: ${tx.transaction.signatures[0]}`);

                            // Puoi aggiungere ulteriori dettagli come account coinvolti, istruzioni, ecc.
                            console.log(`  Involved Accounts:`, tx.transaction.message.accountKeys.map(key => key.toBase58()));
                        });
                    }
                }

                // Aggiorna lo slot corrente
                currentSlot = newSlot;
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    }, 5000);  // Ogni 5 secondi
}

// Avvia il monitoraggio delle transazioni
monitorTransactions();
*/
/* transactions.transactions
meta: {
      computeUnitsConsumed: 2370,
      err: null,
      fee: 5000,
      innerInstructions: [],
      loadedAddresses: [Object],
      logMessages: [Array],
      postBalances: [Array],
      postTokenBalances: [],
      preBalances: [Array],
      preTokenBalances: [],
      rewards: [],
      status: [Object]
    },
    transaction: { message: [Message], signatures: [Array] },
    version: undefined
  },
  {
*/
