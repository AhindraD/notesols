#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("7MZAQw52ZgKMzVhE8VZdZCxxcR9XQfdCcmQSEmu93xjh");

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
        msg!("Created Note: {}", note_entry.title);
        msg!("Message: {}", note_entry.message);
        Ok(())
    }

    //Reading doesn't need any instruction, is fetching on chain data

    pub fn update_note_entry(
        ctx: Context<UpdateNote>,
        _title: String,
        message: String,
    ) -> Result<()> {
        let note_entry = &mut ctx.accounts.note_entry;
        note_entry.owner = ctx.accounts.owner.key();
        note_entry.message = message;
        msg!("Upadted! Message: {}", note_entry.message);
        Ok(())
    }

    pub fn delete_note_entry(_ctx: Context<DeleteNote>, title: String) -> Result<()> {
        msg!("Deleted Note: {}", title);
        Ok(())
    }
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

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateNote<'info> {
    #[account(
    mut,
    seeds=[title.as_bytes(),owner.key().as_ref()],
    bump,
    realloc=ANCHOR_DISCRIMINATOR+NoteEntryState::INIT_SPACE,
    realloc::zero=true,
    realloc::payer=owner,
    )]
    pub note_entry: Account<'info, NoteEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteNote<'info> {
    #[account(
    mut,
    seeds=[title.as_bytes(),owner.key().as_ref()],
    bump,
    close=owner,
    )]
    pub note_entry: Account<'info, NoteEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}
