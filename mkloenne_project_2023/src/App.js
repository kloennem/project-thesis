import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2, Ethrelay, Verilay } from "./abi/abi"; 
import BigNumber from "bignumber.js"
import './App.css';

const RLP = require('rlp');
// const {BaseTrie: Trie} = require('merkle-patricia-tree');
// const {
//     asyncTriePut,
//     newTrie,
//     createRLPHeader,
//     createRLPTransaction,
//     createRLPReceipt,
//     encodeToBuffer
//  } = require('./utils');

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);

const provider = new ethers.providers.Web3Provider(window.ethereum);
provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();


// Contract address of the deployed smart contract
const protocol2Address1 = "0x9F7a9a6aD1f4f2EB779fD635181e2a3397bA47Fa" // for Görli
const protocol2Address2 = "0xB61c9C2824c5d0f7a6B1D6A727904726Bf4872De" // for Görli

const verilayAddress = "0x9dCa11eF2C1F6E958e2B0bfcACe319a55a7C6D40" // for Görli


const transferContract1 = new ethers.Contract(protocol2Address1, Protocol2, signer);
const transferContract2 = new ethers.Contract(protocol2Address2, Protocol2, signer);

const verilayContract = new ethers.Contract(verilayAddress, Verilay, signer);

// const storageContract = new web3.eth.Contract(SimpleStorage, contractAddress); // todo: change variable names, contract name

function App() {
  // Hold variables that will interact with our contract and frontend
  const [number, setUint] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState(0);
  const [burned, setBurned] = useState(0);
  const [getNumber, setGet] = useState("0");
  const [acc, setAcc] = useState(window.ethereum.enable()[0])

  useEffect(() => {
    callSetAcc();
  });
  
  const callSetAcc = async (t) => {
    const account = (await provider.send('eth_requestAccounts'))[0];
    setAcc(account)
  };

  const burnTokens = async (t) => {
    t.preventDefault();
    const burnResult = await transferContract1.burn(recipientAddress, protocol2Address2, 2, 0)
    await burnResult.wait();
    setBurned(burnResult);
  };

  const claimTokens = async (t) => {
    // t.preventDefault();
    // const block             = await web3.eth.getBlock(burned.blockHash);
    // const tx                = await web3.eth.getTransaction(burned.hash);
    // const txReceipt         = await web3.eth.getTransactionReceipt(burned.hash);
    // const rlpHeader         = createRLPHeader(block);
    // const rlpEncodedTx      = createRLPTransaction(tx);
    // const rlpEncodedReceipt = createRLPReceipt(txReceipt);

    // const path = encodeToBuffer(tx.transactionIndex);
    // const rlpEncodedTxNodes = await createTxMerkleProof(block, tx.transactionIndex);
    // const rlpEncodedReceiptNodes = await createReceiptMerkleProof(block, tx.transactionIndex);
    
    // const claimResult = await transferContract2.claim(rlpHeader, rlpEncodedTx, rlpEncodedReceipt, rlpEncodedTxNodes, rlpEncodedReceiptNodes, path);
    // await claimResult.wait();
  };

//   const createTxMerkleProof = async (block, transactionIndex) => {
//     const trie = newTrie();

//     for (let i=0; i<block.transactions.length; i++) {
//        const tx = await web3.eth.getTransaction(block.transactions[i]);
//        const rlpTx = createRLPTransaction(tx);
//        const key = RLP.encode(i);
//        await asyncTriePut(trie, key, rlpTx);
//     }

//     const key = RLP.encode(transactionIndex);
//     return encodeToBuffer(await Trie.createProof(trie, key));
//    };

//    const createReceiptMerkleProof = async (block, transactionIndex) => {
//     const trie = newTrie();

//     for (let i=0; i<block.transactions.length; i++) {
//        const receipt = await web3.eth.getTransactionReceipt(block.transactions[i]);
//        const rlpReceipt = createRLPReceipt(receipt);
//        const key = RLP.encode(i);
//        await asyncTriePut(trie, key, rlpReceipt);
//     }

//     const key = RLP.encode(transactionIndex);
//     return encodeToBuffer(await Trie.createProof(trie, key));
//   }

  const numberSet = async (t) => {
    document.getElementById("helper").value = number
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    setAcc(account)
    // Get permission to access user funds to pay for gas fees
    // const gas = await storageContract.methods.set(number).estimateGas();
    // const post = await storageContract.methods.set(number).send({
    //   from: account,
    //   gas,
    // });
  };

  const numberGet = async (t) => {
    t.preventDefault();
//     const post = await storageContract.methods.get().call();
//     const post2 = BigNumber(post, 10).toString(16)
    const post2 = number.toString(16)
    setGet(post2);
  };


  const setDestAddr = async (t) => {
    document.getElementById("destAddr").value = acc
    setUint(BigNumber(document.getElementById("destAddr").value, 16))
  };
  
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
                onChange={(t) => setUint(BigNumber(t.target.value, 16))}
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
               type="text"
               name="name"
              />
            </form>
          </div>
        </div>
        
        {/* start transaction button */}
        <div className="row" style={{"width":"56vw"}}>
          <form className="form">
            <button className="button" onClick={numberGet} style={{"width":"500px"}} type="button">
              Start Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;