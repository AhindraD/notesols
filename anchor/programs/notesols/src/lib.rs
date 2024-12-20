#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

const ANCHOR_DISCRIMINATOR: usize = 8;

#[program]
pub mod notesols {
    use super::*;

    pub fn create_note_entry(
        ctx: Context<CreateNote>,
        title: String,
        message: String,
    ) -> Result<()> {
        let note_entry = &mut ctx.accounts.note_entry;
        note_entry.owner = ctx.accounts.owner.key();
        note_entry.title = title;
        note_entry.message = message;
        Ok(())
    }

    //Reading doesn't need any instruction, is fetching on chain data
}

//Structure for each notes entry
#[account]
#[derive(InitSpace)]
pub struct NoteEntryState {
    owner: Pubkey,
    #[max_len(30)]
    title: String,
    #[max_len(300)]
    message: String,
}

//Context for all the instructions
#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateNote<'info> {
    #[account(
    init,
    seeds=[title.as_bytes(),owner.key().as_ref()],
    bump,
    payer=owner,
    space=ANCHOR_DISCRIMINATOR+NoteEntryState::INIT_SPACE,
  )]
    pub note_entry: Account<'info, NoteEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}
