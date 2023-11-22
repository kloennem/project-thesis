const Web3 = require("web3")
const ethers = require("ethers")
const express = require('express');
const cors = require('cors');

const {
    createRLPHeader,
    createRLPTransaction,
    createRLPReceipt
} = require('./utils');

const app = express();

const Protocol2 = [
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "tokenContracts",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "txInclVerifier",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_masterAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "claimContract",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Burn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "burnContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "burnTime",
          "type": "uint256"
        }
      ],
      "name": "Claim",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        }
      ],
      "name": "registerTokenContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "claimContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "rlpHeader",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "serializedTx",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "serializedReceipt",
          "type": "bytes"
        },
        {
          "internalType": "bytes32",
          "name": "txHash",
          "type": "bytes32"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
const OracleTxInclusionVerifier = [
    {
      "inputs": [
        {
          "internalType": "address[10]",
          "name": "_oracles",
          "type": "address[10]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "burnBlockHash",
          "type": "bytes32"
        }
      ],
      "name": "OraclePositive",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "burnBlockHash",
          "type": "bytes32"
        }
      ],
      "name": "StartFailed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "burnBlockHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "chainID",
          "type": "uint256"
        }
      ],
      "name": "StartOracle",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_currentBurnBlockHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_chainID",
          "type": "uint256"
        }
      ],
      "name": "startOracle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_verifyTxResult",
          "type": "bool"
        },
        {
          "internalType": "bytes32",
          "name": "_currentBurnBlockHash",
          "type": "bytes32"
        }
      ],
      "name": "fromOracle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_currentBurnBlockHash",
          "type": "bytes32"
        }
      ],
      "name": "verifyTransaction",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    }
  ]
  
  const web3Goerli = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23'));
  const providerGoerli = new ethers.providers.Web3Provider(web3Goerli.currentProvider);
  const signerGoerli = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerGoerli)
  
  const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
  const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");
  const signerBNBTestnet = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerBNBTestnet)

  const protocol2AddressGoerli = "0x4ADA1d5f84f374E2496e0AA537373D5f3853bE78"
  const oracleAddressGoerli = "0x2e04289aC656ad2AacEe244beffE7aAec20778DE"
  
  const protocol2AddressBNBTestnet = "0x8ebD4A32960D9e255b083A18030B4B3C58D01263"
  const oracleAddressBNBTestnet = "0xf28056ac8A93eb5eA9C0864940dD21675BfE85d8"
  
const transferContractGoerli = new ethers.Contract(protocol2AddressGoerli, Protocol2, signerGoerli);
const oracleContractGoerli = new ethers.Contract(oracleAddressGoerli, OracleTxInclusionVerifier, signerGoerli);

const transferContractBNBTestnet = new ethers.Contract(protocol2AddressBNBTestnet, Protocol2, signerBNBTestnet);
const oracleContractBNBTestnet = new ethers.Contract(oracleAddressBNBTestnet, OracleTxInclusionVerifier, signerBNBTestnet);

let executed;
let transferContractSrc;
let transferContractDest;
let web3;
let provider;
const hashToChainMap = new Map();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

app.get('/init', async (req, res) => {
    console.log("start init");
    const tC1 = await transferContractGoerli.registerTokenContract(protocol2AddressGoerli);
    await tC1.wait();
    const tC1_2 = await transferContractGoerli.registerTokenContract(protocol2AddressBNBTestnet);
    await tC1_2.wait();
    const tC2 = await transferContractBNBTestnet.registerTokenContract(protocol2AddressGoerli);
    await tC2.wait();
    const tC2_2 = await transferContractBNBTestnet.registerTokenContract(protocol2AddressBNBTestnet);
    await tC2_2.wait();
    console.log("init completed");
    res.json("")
})

app.post('/postBurn', (req, res) => {
    console.log(req.body.reqStruct);
    console.log(req.body.signature);
    burnTokens(req.body.reqStruct, req.body.signature);
    console.log("burnTokens called");
    res.json({ message: "burn forwarded" });
});

const burnTokens = async (reqStruct, signature) => {
    executed = false;
    const message = ethers.utils.arrayify(ethers.utils.solidityKeccak256(['address', 'uint', 'address', 'address', 'uint'], [reqStruct.from, reqStruct.srcChain, reqStruct.recAddress, reqStruct.targetContract, reqStruct.amount]))
    const messageVerified = await ethers.utils.verifyMessage(message, signature)
    if (messageVerified.toLowerCase() == reqStruct.from) {
        console.log("signature verification successful")
        if(reqStruct.srcChain == 5){
            console.log("burn chain: Görli")
            transferContractSrc = transferContractGoerli;
        }
        else if(reqStruct.srcChain == 97){
            console.log("burn chain: BNB")
            transferContractSrc = transferContractBNBTestnet;
        }
        else{
            console.log("burn: chainID wrong")
        }
        console.log("start burn")
        let burnResult = await transferContractSrc.burn(reqStruct.recAddress, reqStruct.targetContract, reqStruct.amount, reqStruct.from, { gasLimit: 5000000 });
        console.log("waiting for burn to finish")
        await burnResult.wait();
        hashToChainMap.set(burnResult.hash, reqStruct.srcChain);
        console.log(reqStruct.srcChain + ": forwarded burn hash " + burnResult.hash);

        if(reqStruct.targetContract == protocol2AddressGoerli){
            console.log("start oracle on Görli")
            await oracleContractGoerli.startOracle(await burnResult.hash, reqStruct.srcChain);
        }
        else if(reqStruct.targetContract == protocol2AddressBNBTestnet){
            console.log("start oracle on BNB")
            await oracleContractBNBTestnet.startOracle(await burnResult.hash, reqStruct.srcChain);
        }
        else{
            console.log("burn: contract wrong")
        }
    }
    else {
        console.log("signature verification not successful")
    }
};

oracleContractGoerli.on("OraclePositive", async (currentHash) => {
    console.log("oraclePositive event caught (Görli)")
    claimTokens(currentHash, 5);
});

oracleContractBNBTestnet.on("OraclePositive", async (currentHash) => {
    console.log("oraclePositive event caught (BNBTestnet)")
    claimTokens(currentHash, 97);
});

setInterval(async function(){
    let eventFilterGoerli = oracleContractGoerli.filters.OraclePositive()
    let eventsGoerli = await oracleContractGoerli.queryFilter(eventFilterGoerli, -62, -2)
    for(let i = 0; i < eventsGoerli.length; i++){
        if(hashToChainMap.get(eventsGoerli[0].args.burnBlockHash) == 5 || hashToChainMap.get(eventsGoerli[0].args.burnBlockHash) == 97){
            console.log("interval: OraclePositive event caught (Görli)");
            claimTokens(eventsGoerli[0].args.burnBlockHash, 5);
        }
    }
    let eventFilterBNBTestnet = oracleContractBNBTestnet.filters.OraclePositive()
    let eventsBNBTestnet = await oracleContractBNBTestnet.queryFilter(eventFilterBNBTestnet, -62, -2)
    for(let i = 0; i < eventsBNBTestnet.length; i++){
        if(hashToChainMap.get(eventsBNBTestnet[0].args.burnBlockHash) == 5 || hashToChainMap.get(eventsBNBTestnet[0].args.burnBlockHash) == 97){
            console.log("interval: OraclePositive event caught (Görli)");
            claimTokens(eventsBNBTestnet[0].args.burnBlockHash, 97);
        }
    }
}, 60000) // every 60 seconds

const claimTokens = async (currentHash, chainID) => {
    if(chainID == 5){
        transferContractDest = transferContractGoerli;
    }
    else if(chainID == 97){
        transferContractDest = transferContractBNBTestnet;
    }
    else{
        console.log("claim: chainID wrong")
    }

    if(hashToChainMap.get(currentHash) == 5){
        web3 = web3Goerli;
        provider = providerGoerli;
        hashToChainMap.set(currentHash, 0);
    }
    else if(hashToChainMap.get(currentHash) == 97){
        web3 = web3BNBTestnet;
        provider = providerBNBTestnet;
        hashToChainMap.set(currentHash, 0);
    }
    else {
        console.log("source chain of hash not saved");
        return;
    }

    let burnReceipt = await web3.eth.getTransactionReceipt(currentHash)
    while (burnReceipt === null && executed === false) {
        executed = true;
        burnReceipt = await web3.eth.getTransactionReceipt(currentHash)
    }
    executed = true;
    const block = await web3.eth.getBlock(burnReceipt.blockNumber);
    const tx = await provider.getTransaction(currentHash);
    const txReceipt = await web3.eth.getTransactionReceipt(currentHash);
    const rlpHeader = createRLPHeader(block);
    tx.value = (ethers.BigNumber.from(tx.value)).toString();
    tx.gasPrice = (ethers.BigNumber.from(tx.gasPrice)).toString();
    const rlpEncodedTx = createRLPTransaction(tx);
    const rlpEncodedReceipt = createRLPReceipt(txReceipt);

    console.log("before claim")
    const claimResult = await transferContractDest.claim(rlpHeader, rlpEncodedTx, rlpEncodedReceipt, currentHash, { gasLimit: 5000000 });
    await claimResult.wait();
    console.log("after claim")
};