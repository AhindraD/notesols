// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import NotesolsIDL from '../target/idl/notesols.json'
import type { Notesols } from '../target/types/notesols'

// Re-export the generated IDL and type
export { Notesols, NotesolsIDL }

// The programId is imported from the program IDL.
export const NOTESOLS_PROGRAM_ID = new PublicKey(NotesolsIDL.address)

// This is a helper function to get the Notesols Anchor program.
export function getNotesolsProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...NotesolsIDL, address: address ? address.toBase58() : NotesolsIDL.address } as Notesols, provider)
}

// This is a helper function to get the program ID for the Notesols program depending on the cluster.
export function getNotesolsProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Notesols program on devnet and testnet.
      return new PublicKey('487rEoTBR3WViCqXKCWYSxh2d8LgnSpZkDcz3TJwdvco')
    case 'mainnet-beta':
    default:
      return NOTESOLS_PROGRAM_ID
  }
}
