'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useNotesolsProgram } from './notesols-data-access'
import { NotesolsCreate, NotesolsList } from './notesols-ui'

export default function NotesolsFeature() {
  const { publicKey } = useWallet()
  const { programId } = useNotesolsProgram()

  return publicKey ? (
    <div className='py-6'>
      <AppHero
        title="Notesols"
        subtitle={
          'Create a note, also update message and delete it at any time. The note is stored on-chain.'
        }
      >
        <p className="mb-2">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <NotesolsCreate />
      </AppHero>
      <NotesolsList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}