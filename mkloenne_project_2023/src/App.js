import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2 } from "./abi/abi"; 
import './App.css';

const RLP = require('rlp');
const {BaseTrie: Trie} = require('merkle-patricia-tree');
const {
    asyncTriePut,
    newTrie,
    createRLPHeader,
    createRLPTransaction,
    createRLPReceipt,
    encodeToBuffer
 } = require('./utils');

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);

const provider = new ethers.providers.Web3Provider(window.ethereum);
provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();


// Contract address of the deployed smart contract
const protocol2Address1 = "0x302eE5A43e22cdB88440070717b94F9821C64182" // for Görli
const protocol2Address2 = "0x9543e9D776f1654094E995F4Cdc8B0b3791AFC52" // for Görli

const transferContract1 = new ethers.Contract(protocol2Address1, Protocol2, signer);
const transferContract2 = new ethers.Contract(protocol2Address2, Protocol2, signer);


function App() {
  // Hold variables that will interact with our contract and frontend
  const [recipientAddress, setRecipientAddress] = useState(0);      // recipient address
  const [burned, setBurned] = useState(0);                          // address of burn result
  const [acc, setAcc] = useState(0)                                 // source address
  const [tokenAmount, setAmount] = useState(0)

//   useEffect(() => {
//     callSetAcc();
//   });
  
  const callSetAcc = async (t) => {
    t.preventDefault();
    const account = (await provider.send('eth_requestAccounts'))[0];
    setAcc(account)
  };

  const init = async () => {
    const tC1 = await transferContract1.registerTokenContract(protocol2Address2);
    await tC1.wait();
    const tC2 = await transferContract2.registerTokenContract(protocol2Address1);
    await tC2.wait();
  };

  const startTransaction = async (t) => {
    t.preventDefault();
    // await init();
    await getBalance();
    await burnTokens();
    // setTimeout(emptyTimeoutFunction,12000);
    // await claimTokens();
  };
  
  const getBalance = async (t) => {
      // t.preventDefault();    
      const balance110 = await transferContract1.balanceOf(acc)
      const balance210 = await transferContract2.balanceOf(acc)
      const balance220 = await transferContract2.balanceOf(recipientAddress)
      document.getElementById("helper").value = balance110
      document.getElementById("helper1").value = balance210
      document.getElementById("helper2").value = tokenAmount
    };
    
    const burnTokens = async (t) => {
        // t.preventDefault();
        const burnResult = await transferContract1.burn(recipientAddress, protocol2Address2, tokenAmount, 0)
        await burnResult.wait();
        setBurned(burnResult);
        const balance111 = await transferContract1.balanceOf(acc)
        const balance211 = await transferContract2.balanceOf(acc)
        const balance221 = await transferContract2.balanceOf(recipientAddress)
        document.getElementById("helper").value = balance111
        document.getElementById("helper1").value = balance211
        document.getElementById("helper2").value = balance221
    };
    
    const claimTokens = async (t) => {
        // t.preventDefault();
        const block             = await web3.eth.getBlock(burned.blockHash);
        const tx                = await web3.eth.getTransaction(burned.hash);
        const txReceipt         = await web3.eth.getTransactionReceipt(burned.hash);
        const rlpHeader         = createRLPHeader(block);
        const rlpEncodedTx      = createRLPTransaction(tx);
        const rlpEncodedReceipt = createRLPReceipt(txReceipt);
        
        const path = encodeToBuffer(tx.transactionIndex);
        const rlpEncodedTxNodes = await createTxMerkleProof(block, tx.transactionIndex);
        const rlpEncodedReceiptNodes = await createReceiptMerkleProof(block, tx.transactionIndex);
        
        const claimResult = await transferContract2.claim(rlpHeader, rlpEncodedTx, rlpEncodedReceipt, rlpEncodedTxNodes, rlpEncodedReceiptNodes, path);
        await claimResult.wait();
        const balance112 = await transferContract1.balanceOf(acc)
        const balance212 = await transferContract2.balanceOf(acc)
        const balance222 = await transferContract2.balanceOf(recipientAddress)
        document.getElementById("helper").value = balance112
        document.getElementById("helper1").value = balance212
        document.getElementById("helper2").value = balance222
    };

const createTxMerkleProof = async (block, transactionIndex) => {
    const trie = newTrie();

    for (let i=0; i<block.transactions.length; i++) {
        const tx = await web3.eth.getTransaction(block.transactions[i]);
        const rlpTx = createRLPTransaction(tx);
        const key = RLP.encode(i);
        await asyncTriePut(trie, key, rlpTx);
    }
    
    const key = RLP.encode(transactionIndex);
    return encodeToBuffer(await Trie.createProof(trie, key));
   };
   
   const createReceiptMerkleProof = async (block, transactionIndex) => {
       const trie = newTrie();
       
       for (let i=0; i<block.transactions.length; i++) {
           const receipt = await web3.eth.getTransactionReceipt(block.transactions[i]);
           const rlpReceipt = createRLPReceipt(receipt);
           const key = RLP.encode(i);
           await asyncTriePut(trie, key, rlpReceipt);
        }
        
        const key = RLP.encode(transactionIndex);
        return encodeToBuffer(await Trie.createProof(trie, key));
    }
    
    
    const setDestAddr = async (t) => {
        document.getElementById("destAddr").value = acc
        setRecipientAddress(acc)
    };
  
    const emptyTimeoutFunction = async (t) => {}
    
    return (
        <div className="main">
      
      {/* source address */}
      <div className="row" style={{"width":"40vw"}}>
        <form className="form">
          <label>
            Source address:
            <br />
            {acc}
          </label>
          <button className="button" type="submit" onClick={callSetAcc}>
            Reload source address
          </button>
        </form>
      </div>
      
      <div className="card">

        {/* blockchains */}
        <div className="row" style={{"width":"80vw"}}>
          <div class="box">
            <form className="form" style={{"float":"left"}}>
              <label>
                Choose source Blockchain:
              </label>
              <select name="chains" style={{"width":"300px"}}>
                <option selected="selected" value="goerli">Görli</option>
                <option value="sepolia">Sepolia</option>
              </select>
            </form>
            <form className="form" style={{"float":"right"}}>
              <label>
                Choose destination Blockchain:
              </label>
              <select name="chains" style={{"width":"300px"}}>
                <option selected="selected" value="goerli">Görli</option>
                <option value="sepolia">Sepolia</option>
              </select>
            </form>
          </div>
        </div>

        {/* destination address */}
        <div className="row" style={{"width":"76vw"}}>
          <div class="box">
            <form className="form" style={{"float":"left"}}>
              <label>
                Set destination address:
              </label>
              <input
                className="input"
                type="text"
                style={{"width":"250px"}}
                name="name"
                id="destAddr"
                onChange={(t) => setDestAddr}
                />
            </form>
            <button className="button" type="submit" onClick={setDestAddr} style={{"float":"right"}}>Same as source address</button>
          </div>
        </div>

        {/* token type and amount */}
        <div className="row" style={{"width":"80vw"}}>
          <div class="box">
            <form className="form" style={{"float":"left"}}>
              <label>
                Set token type:
              </label>
              <select name="token_type" style={{"width":"300px"}}>
                <option selected="selected" value="example token">Example Token</option>
              </select>
            </form>
            <form className="form" style={{"float":"left"}}>
              <label>
                Set token amount to be sent:
              </label>
              <input
               className="input"
               type="number"
               name="amount"
               id="amount"
               onChange={(t) => setAmount(t.target.value)}
              />
            </form>
          </div>
        </div>
        
        {/* start transaction button */}
        <div className="row" style={{"width":"56vw"}}>
          <form className="form">
            <button className="button" onClick={startTransaction} style={{"width":"500px"}} type="button">
              Start Transaction
            </button>
          </form>
        </div>
        <div className="row">
        <input
                 className="input"
                 type="text"
                 name="helper"
                 id="helper"
               />
             <br />  
             <input
                 className="input"
                 type="text"
                 name="helper1"
                 id="helper1"
               />
             <br />  
             <input
                 className="input"
                 type="text"
                 name="helper2"
                 id="helper2"
               />
        </div>
      </div>
    </div>
  );
}

export default App;