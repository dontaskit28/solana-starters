import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  Program, AnchorProvider, web3
} from '@project-serum/anchor';
import idl from './idl.json';
import BN from 'bn.js'

import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const [inp, setInp] = useState(0);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function createCounter() {    
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
      /* interact with the program via rpc */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }

	async function decrement() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.decrement({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }
  
  async function setCount() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.setting(new BN(inp),{
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div>
        <div style={styles}>
		  <div style={{display:"flex",gap:10}}>
		  {
			value && <input style={inputs} type="number" placeholder="Enter Positive Number" onChange={(e)=>setInp(e.target.value)} />
		  }
		  {
			value && inp >= Number(0) && (<button style={buttonStyle} onClick={setCount}>Set Count</button>)
		  }</div>
          {
            !value && (<button style={buttonStyle} onClick={createCounter}>Create counter</button>)
          }<div style={{display:"flex",gap:10}}>
          {
            value && <button style={buttonStyle} onClick={increment}>Increment</button>
          }
		  {
            value && value> Number(0) && <button style={buttonStyle} onClick={decrement}>Decrement</button>
          }</div>
          {
            value && value >= Number(0) ? (
              <h2>{value}</h2>
            ) : (
              <h3>Please create the counter.</h3>
            )
          }
        </div>
      </div>
    );
  }
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint="https://api.devnet.solana.com">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)
const styles = {
	background:"FloralWhite",
	width:400,
	margin:"auto",
	marginTop:200,
	display:"flex",
	flexDirection:"column",
	padding:30,
	gap:10,
	justifyContent: "center",
	alignItems:"center",
	borderRadius:10,
}

const buttonStyle ={
	width:"fit-content",
	padding:10,
	borderRadius:10,
	fontSize:20,
	background:"#ff445b",
	color:"white",
	border:"none"	
}

const inputs ={
	border:"none",
	borderRadius:10,
	padding:10,
}

export default AppWithProvider;