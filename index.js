const { Connection, clusterApiUrl, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction,SystemProgram,sendAndConfirmTransaction} = require('@solana/web3.js');
//utility
const { lamportsToSol } = require("./utility.js")


// Connessione a un nodo Solana (puoi scegliere devnet, testnet o mainnet-beta)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let currentSlot;

// Airdrop SOL for paying transactions
const airdrop = async() =>{

    let myWallet = Keypair.generate();
    console.log(myWallet);


let airdropSignature = await connection.requestAirdrop(
    myWallet.publicKey,
    LAMPORTS_PER_SOL,
  );
   
  await connection.confirmTransaction({ signature: airdropSignature });
   
  let toAccount = Keypair.generate();
   
  // Create Simple Transaction
  let transaction = new Transaction();
  // Add an instruction to execute
transaction.add(
    SystemProgram.transfer({
      fromPubkey: myWallet.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: 1000,
    }),
  );
   
  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  await sendAndConfirmTransaction(connection, transaction, [myWallet]);
}
airdrop()


const getBlock = async ()=>{
    currentSlot = await connection.getSlot();
    console.log('BlockNumber: '+currentSlot);
}

// get a specific transaction (allowing for v0 transactions)
const getTx = async (tx)=> {
const txx = await connection.getTransaction( tx, { maxSupportedTransactionVersion: 0 } );
console.log(txx)
return txx
}

const tryMe = async ()=>{
    currentSlot=currentSlot+1;
    console.log(currentSlot);
    const transactions = await connection.getBlock(currentSlot, {
  maxSupportedTransactionVersion: 0,
  rewards: false
});
    
    // Se ci sono transazioni nel blocco
    if (transactions && transactions.transactions.length > 0) { 
            console.log(`\nNew transactions in slot ${currentSlot}:`);
            console.log(`\nTotal trans: ${transactions.transactions.length}:`);
        //console.log(transactions);
        //console.log(transactions.transactions);

        for (let slot = 0; slot <= 2/*transactions.transactions.length-1*/; slot++) {
            console.log(`- Transaction Signature: ${transactions.transactions[slot].transaction.signatures[0]}`);
            // Puoi aggiungere ulteriori dettagli come account coinvolti, istruzioni, ecc.
            try{
            console.log(`  Involved Accounts:`, transactions.transactions[slot].transaction.message.accountKeys.map(key => key.toBase58()));
        }catch(e){
            console.log(`  info: ${transactions.transactions[slot].transaction.message}`)
        }
            // console.log(`  allInfo:`, transactions.transactions[slot]);
            //let tmpTx= await getTx(transactions.transactions[slot].transaction.signatures[0]);
            console.log(`  Instruction:`, transactions.transactions[slot].transaction.message.instructions);
            console.log(`  header:`, transactions.transactions[slot].transaction.message.header);
            console.log(`  Fee SOL:`, lamportsToSol(transactions.transactions[slot].meta.fee));
            console.log(`  Log Msg:  ${transactions.transactions[slot].meta.logMessages}\n `);
            console.log(`  Balance:  SOL:${lamportsToSol(transactions.transactions[slot].meta.postBalances[0])}\n SOL:${lamportsToSol(transactions.transactions[slot].meta.postBalances[1])}  `);
            
            //console.log(`  transaction:${0}  `,tmpTx )
            // console.log(`  indexToPrograms IDS:`, transactions.transactions[slot].transaction.message.indexToProgramIds.map(key => key.toBase58()));
        }

         // Itera sulle transazioni trovate
        /*
              transactions.transactions.forEach(async (tx) => {
                      console.log(`- Transaction Signature: ${tx.transaction.signatures[0]}`);
                    // Puoi aggiungere ulteriori dettagli come account coinvolti, istruzioni, ecc.
                  console.log(`  Involved Accounts:`, tx.transaction.message.accountKeys.map(key => key.toBase58()));
                  let tmpTx= await getTx(tx.transaction.signatures[0]);
                  console.log(`  transaction:${tmpTx}` )
                        });*/
                        //fine itera
            
   }//fine if
}
setInterval(tryMe,10000)

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
