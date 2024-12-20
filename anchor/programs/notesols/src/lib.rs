#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod notesols {
    use super::*;

  pub fn close(_ctx: Context<CloseNotesols>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.notesols.count = ctx.accounts.notesols.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.notesols.count = ctx.accounts.notesols.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeNotesols>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.notesols.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeNotesols<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Notesols::INIT_SPACE,
  payer = payer
  )]
  pub notesols: Account<'info, Notesols>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseNotesols<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub notesols: Account<'info, Notesols>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub notesols: Account<'info, Notesols>,
}

#[account]
#[derive(InitSpace)]
pub struct Notesols {
  count: u8,
}
