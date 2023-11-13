import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2, OracleTxInclusionVerifier } from "./abi/abi"; 
import './App.css';
import { keccak256 } from "ethers/lib/utils";

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

// for BNB Testnet
const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");
const signerBNBTestnet = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerBNBTestnet)


// Contract addresses of the deployed smart contract
// for Görli
const protocol2Address1Goerli = "0xAC446Ea847d893F15d8ae12b841C7284300c0627"
const protocol2Address2Goerli = "0xbb97cbb6860cF6583844709A9f9f035D8811D650"
const verifierAddressGoerli = "0x7574284933e8a53bf3Ef1c72f39605b685aA58a7"

// for BNB Testnet
const protocol2Address1BNBTestnet = "0x6c657149Eaa9953dBFc44Aa02b8313178B847ce9"
const protocol2Address2BNBTestnet = "0x73278Fea53Aeb67F9Af194aF53c1159F419a7ccF"
const verifierAddressBNBTestnet = "0x266642C5F0c69c494437B0E5400E2BEe732A3301"


let protocol2Address1Src = protocol2Address1Goerli;
let protocol2Address2Src;
let verifierAddressSrc = verifierAddressGoerli;
let transferContractSrc;
let transferContractDest;
let verifierContract;
let web3;
let provider;
let executed = false;

let prov = new ethers.providers.Web3Provider(window.ethereum);
prov.send('eth_requestAccounts',[]);
transferContractSrc = new ethers.Contract(protocol2Address1Src, Protocol2, prov.getSigner());
verifierContract = new ethers.Contract(verifierAddressSrc, OracleTxInclusionVerifier, prov.getSigner());


function App() {
  // Hold variables that will interact with our contract and frontend
  const [recipientAddress, setRecipientAddress] = useState(0);      // recipient address
  const [burned, setBurned] = useState(0);                          // address of burn result
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
    prov = new ethers.providers.Web3Provider(window.ethereum);
    let temp = ((await prov.getNetwork()).chainId)
    if(temp === 5){
        protocol2Address1Src = protocol2Address1Goerli;
        protocol2Address2Src = protocol2Address2Goerli; // todo: change to BNB + init
        verifierAddressSrc = verifierAddressGoerli;
        web3 = web3Goerli;
        provider = providerGoerli;
        verifierContract = new ethers.Contract(verifierAddressSrc, OracleTxInclusionVerifier, prov.getSigner());
        setCurrentNetwork("Görli");
    }
    else if(temp === 97){
        protocol2Address1Src = protocol2Address1BNBTestnet;
        protocol2Address2Src = protocol2Address2BNBTestnet; // todo: change to Goerli + init
        verifierAddressSrc = verifierAddressBNBTestnet;
        web3 = web3BNBTestnet;
        provider = providerBNBTestnet;
        verifierContract = new ethers.Contract(verifierAddressSrc, OracleTxInclusionVerifier, signerBNBTestnet);
        setCurrentNetwork("BNB Testnet");
    }
    const account = (await prov.send('eth_requestAccounts'))[0];
    setAcc(account)
    transferContractSrc = new ethers.Contract(protocol2Address1Src, Protocol2, prov.getSigner());
    transferContractDest = new ethers.Contract(protocol2Address2Src, Protocol2, prov.getSigner());
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
    prov = new ethers.providers.Web3Provider(window.ethereum);
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
    // await getBalance();
    // await burnTokens();
    claimTokens();
    // await verifierContract.startOracle(burned.hash)
    // let temp = await verifierContract.getCurrentCounter();
    // let temp = await verifierContract.getCurrentBurnBlockHashes();
    // let burnReceipt = await web3.eth.getTransactionReceipt(burned.hash)
    // document.getElementById("helper2").value = temp
    // document.getElementById("helper1").value = burned.hash
};

const getBalance = async (t) => {
    // t.preventDefault();    
    const balance110 = await transferContractSrc.balanceOf(acc)
      const balance210 = await transferContractDest.balanceOf(acc)
      const balance220 = await transferContractDest.balanceOf(recipientAddress)
      document.getElementById("helper").value = balance110
      document.getElementById("helper1").value = balance210
      document.getElementById("helper2").value = (await provider.getNetwork()).chainId
    };
    
    const burnTokens = async (t) => {
        // t.preventDefault();
        executed = false;
        const burnResult = await transferContractSrc.burn(recipientAddress, protocol2Address2Src, tokenAmount, 0)
        await burnResult.wait();
        setBurned(burnResult);
        const balance111 = await transferContractSrc.balanceOf(acc)
        const balance211 = await transferContractDest.balanceOf(acc)
        const balance221 = await transferContractDest.balanceOf(recipientAddress)
        document.getElementById("helper").value = balance111
        document.getElementById("helper1").value = balance211
        document.getElementById("helper2").value = burnResult.hash
        await verifierContract.startOracle(burnResult.hash)
    };
    
    verifierContract.on("OraclePositive", async (currentHash)=>{
        try{
        document.getElementById("helper2").value = "success";
        claimTokens();
        } catch(e){}
    })
    
    const claimTokens = async (t) => {
        // t.preventDefault();
        // try{
        let burnReceipt = await web3.eth.getTransactionReceipt(await burned.hash)
        while(burnReceipt == null && executed == false){
            executed = true;
            burnReceipt = await web3.eth.getTransactionReceipt(burned.hash)
        }
        document.getElementById("helper2").value = "executed worked";
        const block             = await web3.eth.getBlock(burnReceipt.blockNumber);
        const tx                = await web3.eth.getTransaction(burned.hash);
        const txReceipt         = await web3.eth.getTransactionReceipt(burned.hash);
        const rlpHeader         = createRLPHeader(block);
        const rlpEncodedTx      = createRLPTransaction(tx);
        const rlpEncodedReceipt = createRLPReceipt(txReceipt);
        
        document.getElementById("helper1").value = block.transactions.length
        const path = encodeToBuffer(tx.transactionIndex);
        const rlpEncodedTxNodes = await createTxMerkleProof(block, tx.transactionIndex);
        const rlpEncodedReceiptNodes = await createReceiptMerkleProof(block, tx.transactionIndex);
        
        document.getElementById("helper").value = "before claim"
        const claimResult = await transferContractDest.claim(rlpHeader, rlpEncodedTx, rlpEncodedReceipt, rlpEncodedTxNodes, rlpEncodedReceiptNodes, path, burned.hash);
        await claimResult.wait();
        document.getElementById("helper").value = "after claim"
        const balance112 = await transferContractSrc.balanceOf(acc)
        const balance212 = await transferContractDest.balanceOf(acc)
        const balance222 = await transferContractDest.balanceOf(recipientAddress)
        document.getElementById("helper").value = balance112
        document.getElementById("helper1").value = balance212
        document.getElementById("helper2").value = balance222
        // } catch(e){}
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