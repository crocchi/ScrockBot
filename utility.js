// Conversion rate: 1 SOL = 1,000,000,000 lamports
const LAMPORTS_PER_SOL = 1000000000;

// Function to convert lamports to SOL
const lamportsToSol= (lamports)=> {
  return lamports / LAMPORTS_PER_SOL;
}


module.exports = { lamportsToSol }
