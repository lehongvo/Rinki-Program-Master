use anchor_lang::prelude::*;

/**
 * Set favorite event
 * This event is emitted when a user sets a favorite
 * @param user: The public key of the user who set the favorite
 * @param number: The number of the favorite
 * @param color: The color of the favorite
 * @param hashtag: The hashtag of the favorite
*/
#[event]
pub struct SetFavoriteEvent {
    pub user: Pubkey,
    pub number: u64,
    pub color: String,
    pub hashtag: Vec<String>,
}

/**
 * Delete favorite event
 * This event is emitted when a user deletes a favorite
 * @param user: The public key of the user who deleted the favorite
*/
#[event]
pub struct DeleteFavoriteEvent {
    pub user: Pubkey,
}
