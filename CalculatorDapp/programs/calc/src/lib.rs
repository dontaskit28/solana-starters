use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("3iAQAbtjS1pp7jtx2YjMPh2GcUSEu9WZ8nS9ZH6H3jzu");

#[program]
pub mod calc {
    use super::*;

    pub fn create(ctx: Context<Create>, init_message: String) -> ProgramResult {
        let calc = &mut ctx.accounts.calculator;
        calc.greeting = init_message;
        Ok(())
    }

    pub fn add(ctx: Context<Addition>, num1: u32, num2: u32) -> ProgramResult {
        let calc = &mut ctx.accounts.calculator;
        calc.result = num1 + num2;
        Ok(())
    }

    pub fn multiply(ctx: Context<Multiplication>, num1: u32, num2: u32) -> ProgramResult {
        let calc = &mut ctx.accounts.calculator;
        calc.result = num1 * num2;
        Ok(())
    }

    pub fn subtract(ctx: Context<Subtraction>, num1: u32, num2: u32) -> ProgramResult {
        let calc = &mut ctx.accounts.calculator;
        calc.result = num1 - num2;
        Ok(())
    }

    pub fn divide(ctx: Context<Division>, num1: u32, num2: u32) -> ProgramResult {
        let calc = &mut ctx.accounts.calculator;
        calc.result = num1 / num2;
        Ok(())
    }
}

#[account]
pub struct Calculator {
    pub greeting: String,
    pub result: u32,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 40)]
    pub calculator: Account<'info, Calculator>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Addition<'info> {
    #[account(mut)]
    pub calculator: Account<'info, Calculator>,
}

#[derive(Accounts)]
pub struct Multiplication<'info> {
    #[account(mut)]
    pub calculator: Account<'info, Calculator>,
}

#[derive(Accounts)]
pub struct Subtraction<'info> {
    #[account(mut)]
    pub calculator: Account<'info, Calculator>,
}

#[derive(Accounts)]
pub struct Division<'info> {
    #[account(mut)]
    pub calculator: Account<'info, Calculator>,
}
