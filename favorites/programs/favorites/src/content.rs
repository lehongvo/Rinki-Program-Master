use anchor_lang::prelude::*;
pub use crate::constant::{ANCHOR_DISCRIMINATOR_LENGTH, ADMIN_PUBKEY};

#[account]
#[derive(InitSpace)]
pub struct FavoriteAccount {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hashtag: Vec<String>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub created_at: i64,
}

#[derive(Accounts)]
pub struct SetFavorite<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_LENGTH + FavoriteAccount::INIT_SPACE,
        seeds = [b"favorite", user.key().as_ref()],
        bump,
    )]
    pub favorites: Account<'info, FavoriteAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteFavorite<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut, 
        close = user,
        seeds = [b"favorite", user.key().as_ref()], 
        bump
    )]
    pub favorites: Account<'info, FavoriteAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = admin, 
        space = ANCHOR_DISCRIMINATOR_LENGTH + Config::INIT_SPACE, 
        seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}