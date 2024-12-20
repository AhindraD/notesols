import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Notesols} from '../target/types/notesols'

describe('notesols', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Notesols as Program<Notesols>

  const notesolsKeypair = Keypair.generate()

  it('Initialize Notesols', async () => {
    await program.methods
      .initialize()
      .accounts({
        notesols: notesolsKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([notesolsKeypair])
      .rpc()

    const currentCount = await program.account.notesols.fetch(notesolsKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Notesols', async () => {
    await program.methods.increment().accounts({ notesols: notesolsKeypair.publicKey }).rpc()

    const currentCount = await program.account.notesols.fetch(notesolsKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Notesols Again', async () => {
    await program.methods.increment().accounts({ notesols: notesolsKeypair.publicKey }).rpc()

    const currentCount = await program.account.notesols.fetch(notesolsKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Notesols', async () => {
    await program.methods.decrement().accounts({ notesols: notesolsKeypair.publicKey }).rpc()

    const currentCount = await program.account.notesols.fetch(notesolsKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set notesols value', async () => {
    await program.methods.set(42).accounts({ notesols: notesolsKeypair.publicKey }).rpc()

    const currentCount = await program.account.notesols.fetch(notesolsKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the notesols account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        notesols: notesolsKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.notesols.fetchNullable(notesolsKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
