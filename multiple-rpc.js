import { Connection, PublicKey } from '@solana/web3.js';
import 'dotenv/config';

class ConnectionPool {
    constructor(endpoints) {
        this.connections = endpoints.map(endpoint => ({
            rpcUrl: endpoint.rpc,
            connection: new Connection(endpoint.rpc, { wsEndpoint: endpoint.wss }),
        }));
    }
}

let latestLoggedBalance = null; // Shared state to track the latest logged balance

function listenForBalanceChanges(publicKey, connectionPool) {
    connectionPool.connections.forEach(({ connection, rpcUrl }) => {
        console.log(`Setting up balance change listener for node: ${rpcUrl.slice(0,33)}`);
        connection.onAccountChange(new PublicKey(publicKey), (accountInfo) => {
            const newBalance = accountInfo.lamports;

            // Check if this balance change has already been logged
            if (latestLoggedBalance !== newBalance) {
                const now = new Date();
                const dateTimeString = now.toISOString(); // Converts current time to ISO 8601 format

                console.log(`[${dateTimeString}] Balance change detected on node: ${rpcUrl.slice(0,33)}`);
                console.log(`[${dateTimeString}] New balance: ${newBalance} lamports`);
                console.log("======================================================================")

                // Update the shared state with the new balance
                latestLoggedBalance = newBalance;
            }
        }, 'confirmed');
    });
}

(async () => {
    const nodeEndpoints = [
        { rpc: process.env.SOLANA_RPC_NODE_1, wss: process.env.SOLANA_WSS_NODE_1 },
        { rpc: process.env.SOLANA_RPC_NODE_2, wss: process.env.SOLANA_WSS_NODE_2 },
        { rpc: process.env.SOLANA_RPC_NODE_3, wss: process.env.SOLANA_WSS_NODE_3 },
    ];
    
    const connectionPool = new ConnectionPool(nodeEndpoints);
    const publicKey = "G98hD3T33SiJa8WcWgJ9coT5fz1F3ciwJjKnecxxd3Bi"; // Replace with the address you're interested in

    // Listen for balance changes on all nodes
    listenForBalanceChanges(publicKey, connectionPool);
})();
