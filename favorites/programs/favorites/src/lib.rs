use anchor_lang::prelude::*;
use std::str::FromStr;
mod constant;
mod event;
mod error;
mod content;
pub use event::*;
pub use error::*;
pub use content::*;


declare_id!("EZDVcgsQfAA2EJcgfwGkWcYqvZA9JBsDe5tVB27FD2nr");

#[program]
pub mod favorites {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require_keys_eq!(ctx.accounts.admin.key(), Pubkey::from_str(ADMIN_PUBKEY).unwrap(), CustomError::UnauthorizedAdmin);
        config.admin = ctx.accounts.admin.key();
        config.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn set_favorite(ctx: Context<SetFavorite>, number: u64, color: String, hashtag: Vec<String>) -> Result<()> {
        let favorite_account = &mut ctx.accounts.favorites;
        favorite_account.number = number;
        favorite_account.color = color;
        favorite_account.hashtag = hashtag.clone();

        emit!(SetFavoriteEvent {
            user: ctx.accounts.user.key(),
            number,
            color: favorite_account.color.clone(),
            hashtag: favorite_account.hashtag.clone(),
        });
        Ok(())
    }

    pub fn delete_favorite(ctx: Context<DeleteFavorite>) -> Result<()> {
        let favorite_account = &mut ctx.accounts.favorites;
        favorite_account.number = 0;
        favorite_account.color = String::new();
        favorite_account.hashtag = Vec::new();

        emit!(DeleteFavoriteEvent {
            user: ctx.accounts.user.key(),
        });
        Ok(())
    }
}
