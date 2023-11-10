import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2, OracleTxInclusionVerifier } from "./abi/abi"; 
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
// for Görli
const web3Goerli = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23"))
const providerGoerli = new ethers.providers.Web3Provider(web3Goerli.currentProvider);
const signerGoerli = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerGoerli)

// for BNB Testnet
const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
const providerBNBTestnet = new ethers.providers.Web3Provider(web3BNBTestnet.currentProvider);
const signerBNBTestnet = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerBNBTestnet)


// Contract addresses of the deployed smart contract
// for Görli
const protocol2Address1Goerli = "0x40f94B9EecE9DE0892D124C698fBD6FA36c3f80b"
const protocol2Address2Goerli = "0xb9B56965B0522C674E97e10Acffa7ae28024cD7c"
const verifierAddressGoerli = "0xDFabC31177166199B18D92B76b7AE158D76dAd8C"

// for BNB Testnet
const protocol2Address1BNBTestnet = "0x072622F7349575bee212CFEab40b9edB044711Be"
const protocol2Address2BNBTestnet = "0x8604d996ebB5180da6674Df3c98238a5F2c27B3C"
const verifierAddressBNBTestnet = "0xa0cff663BaD972fD5a433Fc7F023FD7f4aD8E60c"


let protocol2Address1Src = protocol2Address1Goerli;
let protocol2Address2Src;
let verifierAddressSrc;
let transferContractSrc;
let transferContractDest;
let verifierContract;
let web3;
let provider;
let signer;

let prov = new ethers.providers.Web3Provider(window.ethereum);
prov.send('eth_requestAccounts',[]);
transferContractSrc = new ethers.Contract(protocol2Address1Src, Protocol2, prov.getSigner());


function App() {
  // Hold variables that will interact with our contract and frontend
  const [recipientAddress, setRecipientAddress] = useState(0);      // recipient address
  const [burned, setBurned] = useState(0);                          // address of burn result
  const [burnHash, setBurnHash] = useState(0)
  const [acc, setAcc] = useState(0)                                 // source address
  const [tokenAmount, setAmount] = useState(0)
  const [currentNetwork, setCurrentNetwork] = useState("")

  useEffect(() => {
    setNetwork();
  });

  window.ethereum.on('networkChanged', function(networkId){
    document.getElementById("helper2").value = networkId
    setNetwork();
  });

  window.ethereum.on('accountsChanged', function (accounts) {
    callSetAcc();
  });
  
  const setNetwork = async (t) => {
    let prov = new ethers.providers.Web3Provider(window.ethereum);
    let temp = ((await prov.getNetwork()).chainId)
    if(temp === 5){
        protocol2Address1Src = protocol2Address1Goerli;
        protocol2Address2Src = protocol2Address2Goerli; // todo: change to BNB + init
        verifierAddressSrc = verifierAddressGoerli;
        web3 = web3Goerli;
        provider = providerGoerli;
        signer = signerGoerli;
        setCurrentNetwork("Görli");
    }
    else if(temp === 97){
        protocol2Address1Src = protocol2Address1BNBTestnet;
        protocol2Address2Src = protocol2Address2BNBTestnet; // todo: change to Goerli + init
        verifierAddressSrc = verifierAddressBNBTestnet;
        web3 = web3BNBTestnet;
        provider = providerBNBTestnet;
        signer = signerBNBTestnet;
        setCurrentNetwork("BNB Testnet");
    }
    const account = (await prov.send('eth_requestAccounts'))[0];
    setAcc(account)
    transferContractSrc = new ethers.Contract(protocol2Address1Src, Protocol2, prov.getSigner());
    transferContractDest = new ethers.Contract(protocol2Address2Src, Protocol2, prov.getSigner());
    verifierContract = new ethers.Contract(verifierAddressSrc, OracleTxInclusionVerifier, prov.getSigner());
  }

//   transferContractSrc.on("Burn", async (from, to, contract, value)=>{
//     let transferEvent ={
//         from: from,
//         to: to,
//         value: value,
//         contract: contract,
//     }
//     setTimeout(emptyTimeoutFunction,15000);
//     burnHandler();
// })

//   const burnHandler = async (t) => {
//     document.getElementById("helper1").value = burnHash
//     const verifyResult = await verifierContract.startOracle(burnHash)
//   };

const callSetAcc = async (t) => {
    // t.preventDefault();
    let prov = new ethers.providers.Web3Provider(window.ethereum);
    const account = (await prov.send('eth_requestAccounts'))[0];
    setAcc(account)
  };

  const init = async () => {
    const tC1 = await transferContractSrc.registerTokenContract(protocol2Address2Src);
    await tC1.wait();
    const tC2 = await transferContractDest.registerTokenContract(protocol2Address1Src);
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
      const balance110 = await transferContractSrc.balanceOf(acc)
      const balance210 = await transferContractDest.balanceOf(acc)
      const balance220 = await transferContractDest.balanceOf(recipientAddress)
      document.getElementById("helper").value = balance110
      document.getElementById("helper1").value = burnHash
      document.getElementById("helper2").value = (await provider.getNetwork()).chainId
    };
    
    const burnTokens = async (t) => {
        // t.preventDefault();
        const burnResult = await transferContractSrc.burn(recipientAddress, protocol2Address2Src, tokenAmount, 0)
        await burnResult.wait();
        setBurned(burnResult);
        // await setBurnHash(burnResult.hash)
        const balance111 = await transferContractSrc.balanceOf(acc)
        const balance211 = await transferContractDest.balanceOf(acc)
        const balance221 = await transferContractDest.balanceOf(recipientAddress)
        document.getElementById("helper").value = balance111
        document.getElementById("helper1").value = balance211
        document.getElementById("helper2").value = burnResult.hash
        const verifyResult = await verifierContract.startOracle(burnResult.hash)
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
        
        const claimResult = await transferContractDest.claim(rlpHeader, rlpEncodedTx, rlpEncodedReceipt, rlpEncodedTxNodes, rlpEncodedReceiptNodes, path);
        await claimResult.wait();
        const balance112 = await transferContractSrc.balanceOf(acc)
        const balance212 = await transferContractDest.balanceOf(acc)
        const balance222 = await transferContractDest.balanceOf(recipientAddress)
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
                Source Blockchain:
                <br />
                {currentNetwork}
              </label>
            </form>
            <form className="form" style={{"float":"right"}}>
              <label>
                Choose destination Blockchain:
              </label>
              <select name="chains" style={{"width":"300px"}}>
                <option selected="selected" value="goerli">Görli</option>
                <option value="bnb_testnet">BNB Testnet</option>
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