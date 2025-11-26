import { Connection, PublicKey, Commitment } from '@solana/web3.js';

export function getSolanaRpcUrl(): string {
  return process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
}

export function getConnection(commitment: Commitment = 'confirmed'): Connection {
  return new Connection(getSolanaRpcUrl(), commitment);
}

export async function findSignaturesForReference(referenceBase58: string, limit = 20): Promise<string[]> {
  const connection = getConnection('confirmed');
  const refKey = new PublicKey(referenceBase58);
  const infos = await connection.getSignaturesForAddress(refKey, { limit });
  return infos.map(i => i.signature);
}
