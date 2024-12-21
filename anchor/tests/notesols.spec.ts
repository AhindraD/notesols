import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { Notesols } from '../target/types/notesols'

async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}
function getNotePDA(title: string, author: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(title),
      author.toBuffer()
    ], programID);
}


describe('notesols', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Notesols as Program<Notesols>;

  const notesolsKeypair = Keypair.generate();

  it("Create a Note", async () => {
    let title: string = "Test Note";
    let message: string = "This is a test message.";
    await airdrop(provider.connection, notesolsKeypair.publicKey);
    const [note_pda, note_bump] = getNotePDA(title, notesolsKeypair.publicKey, program.programId);

    await program.methods
      .createNoteEntry(title, message)
      .accountsPartial({
        noteEntry: note_pda,
        owner: notesolsKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([notesolsKeypair])
      .rpc({ commitment: "confirmed" });

    const note = await program.account.noteEntryState.fetch(note_pda);

    expect(note.title).toEqual(title);
    expect(note.message).toEqual(message);
    expect(note.owner).toEqual(notesolsKeypair.publicKey);
  })


  it("Update a Note", async () => {
    let title: string = "Test Note";
    let updated_message: string = "Updated message.";
    await airdrop(provider.connection, notesolsKeypair.publicKey);
    const [note_pda, note_bump] = getNotePDA(title, notesolsKeypair.publicKey, program.programId);

    await program.methods
      .updateNoteEntry(title, updated_message)
      .accountsPartial({
        noteEntry: note_pda,
        owner: notesolsKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([notesolsKeypair])
      .rpc({ commitment: "confirmed" });

    const note = await program.account.noteEntryState.fetch(note_pda);

    expect(note.title).toEqual(title);
    expect(note.message).toEqual(updated_message);
    expect(note.owner).toEqual(notesolsKeypair.publicKey);
  })

  it("Delete a Note", async () => {
    let title: string = "Test Note";
    await airdrop(provider.connection, notesolsKeypair.publicKey);
    const [note_pda, note_bump] = getNotePDA(title, notesolsKeypair.publicKey, program.programId);

    await program.methods
      .deleteNoteEntry(title)
      .accountsPartial({
        noteEntry: note_pda,
        owner: notesolsKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([notesolsKeypair])
      .rpc({ commitment: "confirmed" });

    try {
      await program.account.noteEntryState.fetch(note_pda);
    } catch (error) {
      expect(error);
    }
  })
})
