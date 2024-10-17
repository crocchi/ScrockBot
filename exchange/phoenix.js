//phoenix exchange
const contract="PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY";

const solanaWeb3 = require('@solana/web3.js');

// Connessione alla mainnet-beta di Solana
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl('mainnet-beta'),
  'confirmed'
);

(async () => {
  const programId = new solanaWeb3.PublicKey(contract);

  // Ascolta le transazioni che coinvolgono il programma Raydium AMM
  connection.onLogs(programId, (logs, ctx) => {
    console.log("Nuova transazione trovata:");
    console.log("Log:", logs.logs);
    console.log("Slot:", logs.slot);

    // Se vuoi processare ulteriormente, puoi filtrare gli eventi qui
    // Analizza i log per individuare specifiche azioni come scambi, depositi o prelievi.
  });
})();

