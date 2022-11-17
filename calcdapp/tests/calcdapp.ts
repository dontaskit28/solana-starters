import * as anchor from "@project-serum/anchor";
import { strict as assert } from 'assert';
const { SystemProgram } = anchor.web3;

describe("calcdapp", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Calcdapp;
  

  it('Creates a calculator', async () => {
    await program.rpc.create("A simple calculator", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator]
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === "A simple calculator");
    
  });

  it('Adding function',async()=>{
    await program.rpc.add(new anchor.BN(4),new anchor.BN(6),{
      accounts:{
        calculator:calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(10)));
  });

  it('Subtraction function',async()=>{
    await program.rpc.subtract(new anchor.BN(4),new anchor.BN(6),{
      accounts:{
        calculator:calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(-2)));
  });

  it('Multiply function',async()=>{
    await program.rpc.multiply(new anchor.BN(4),new anchor.BN(6),{
      accounts:{
        calculator:calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(24)));
  });

  it('Division function',async()=>{
    await program.rpc.divide(new anchor.BN(4),new anchor.BN(6),{
      accounts:{
        calculator:calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.remainder.eq(new anchor.BN(4)));
    assert.ok(account.greeting === "A simple calculator");
  });
});
