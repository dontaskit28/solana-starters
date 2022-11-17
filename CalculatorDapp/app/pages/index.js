import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";
import BN from "bn.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [new PhantomWalletAdapter()];
const { SystemProgram, Keypair } = web3;
const calculator = Keypair.generate();
const opts = {
  preflightCommitment: "processed",
};
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);
  const wallet = useWallet();
  async function getProvider() {
    const network = "http://localhost:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      wallet,
      opts.preflightCommitment
    );
    return provider;
  }

  async function createCalculator() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.create("Welcome to Calculator", {
        accounts: {
          calculator: calculator.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [calculator],
      });
      console.log(await program.account);
      const account = await program.account.calculator.fetch(
        calculator.publicKey
      );
      console.log("account: ", account);
      setMessage(account.greeting);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function add() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.add(new BN(value), new BN(value2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    setResult("Addition Result: " + account.result.toString());
  }

  async function multiply() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.multiply(new BN(value), new BN(value2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    setResult("Multiplication Result: " + account.result.toString());
  }

  async function subtract() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.subtract(new BN(value), new BN(value2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    setResult("Subtraction Result: " + account.result.toString());
  }

  async function divide() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.divide(new BN(value), new BN(value2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    setResult("Division Result: " + account.result.toString());
  }
  if (!wallet.connected) {
    return (
      <div className="flex justify-items-center mt-10">
        <WalletMultiButton />
      </div>
    );
  } else {
    return (
        <div>
          <div className="flex flex-col gap-6 mt-20">
            {message == null ? (
              <button
                className="text-2xl text-red-500 font-bold"
                onClick={createCalculator}>
                Create Calculator
              </button>
            ) : (
              <p className="flex justify-center text-2xl text-red-500 font-bold">
                {message}
              </p>
            )}
            {message && (
              <div className="flex gap-4 justify-center">
                <input
                  className="border-2 p-2 rounded"
                  type="number"
                  placeholder="Enter Number 1"
                  onChange={(e) => setValue(e.target.value)}
                />
                <input
                  className="border-2 p-2 rounded"
                  type="number"
                  placeholder="Enter Number 2"
                  onChange={(e) => setValue2(e.target.value)}
                />
              </div>
            )}
            {value && value2 && (
              <div className="flex justify-center gap-4">
                <button
                  className="border-2 bg-indigo-200 p-2 rounded"
                  onClick={add}>
                  Addition
                </button>
                <button
                  className="border-2 bg-indigo-200 p-2 rounded"
                  onClick={multiply}>
                  Multiply
                </button>
                <button
                  className="border-2 bg-indigo-200 p-2 rounded"
                  onClick={subtract}>
                  Subtract
                </button>
                <button
                  className="border-2 bg-indigo-200 p-2 rounded"
                  onClick={divide}>
                  Division
                </button>
              </div>
            )}
            {result && (
              <p className="text-3xl text-pink-500 flex justify-center">
                {result}
              </p>
            )}
          </div>
        </div>
    );
  }
}
const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://localhost:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default AppWithProvider;
