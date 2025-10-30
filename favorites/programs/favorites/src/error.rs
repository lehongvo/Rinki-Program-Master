use anchor_lang::prelude::*;

/**
 * Custom error codes
 * This is the custom error codes for the favorites program
 * @param UnauthorizedAdmin: The admin is not authorized to call this instruction
 * @param ConfigAlreadyInitialized: The config is already initialized
*/
#[error_code]
pub enum CustomError {
    #[msg("Only admin can call this instruction")]
    UnauthorizedAdmin,
    #[msg("Config already initialized")]
    ConfigAlreadyInitialized,
}
