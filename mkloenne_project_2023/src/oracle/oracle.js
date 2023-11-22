const Web3 = require("web3")
const ethers = require("ethers")

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

const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23'));
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", provider)

const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");
const signerBNBTestnet = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerBNBTestnet)

const oracleAddressGoerli = "0x2e04289aC656ad2AacEe244beffE7aAec20778DE"

const oracleAddressBNBTestnet = "0xf28056ac8A93eb5eA9C0864940dD21675BfE85d8"

const oracleContractGoerli = new ethers.Contract(oracleAddressGoerli, OracleTxInclusionVerifier, signer);
const oracleContractBNBTestnet = new ethers.Contract(oracleAddressBNBTestnet, OracleTxInclusionVerifier, signerBNBTestnet);

let transactionVerified = false;
const map = new Map();

console.log("Start")
setInterval(async function(){
    let eventFilterGoerli = oracleContractGoerli.filters.StartOracle()
    let eventsGoerli = await oracleContractGoerli.queryFilter(eventFilterGoerli, -62, -2)
    for(let i = 0; i < eventsGoerli.length; i++){
        if(map.get(eventsGoerli[i].args.burnBlockHash) == false){
            console.log("interval: start event caught (Görli)")
            startOracleGoerli(eventsGoerli[i].args.burnBlockHash, eventsGoerli[i].args.chainID);
        }
    }
    let eventFilterBNBTestnet = oracleContractBNBTestnet.filters.StartOracle()
    let eventsBNBTestnet = await oracleContractBNBTestnet.queryFilter(eventFilterBNBTestnet, -62, -2)
    for(let i = 0; i < eventsBNBTestnet.length; i++){
        if(map.get(eventsBNBTestnet[i].args.burnBlockHash) == false){
            console.log("interval: start event caught (Görli)")
            startOracleBNBTestnet(eventsBNBTestnet[i].args.burnBlockHash, eventsBNBTestnet[i].args.chainID);
        }
    }
}, 60000) // every 60 seconds

oracleContractGoerli.on("StartOracle", async (blockHash, chainID) => {
    console.log("start event caught (Görli)")
    startOracleGoerli(blockHash, chainID);
})

oracleContractBNBTestnet.on("StartOracle", async (blockHash, chainID) => {
    console.log("start event caught (BNB)")
    startOracleBNBTestnet(blockHash, chainID);
})

async function startOracleGoerli(blockHash, chainID){
    if(chainID == 5){
        console.log("Oracle started on Görli")
        console.log("burn transaction on Görli")
        const burnReceipt = await web3.eth.getTransactionReceipt(blockHash)
        const block = await web3.eth.getBlock(burnReceipt.blockNumber);
        while(provider.getBlockNumber()-block.blockNumber < 12){}
        if(block.transactions[burnReceipt.transactionIndex] == blockHash && burnReceipt.status == true){
            transactionVerified = true;
        }
        else{
            console.log("transaction not contained in block")
            return;
        }
    }
    else if(chainID == 97){
        const burnReceipt = await web3BNBTestnet.eth.getTransactionReceipt(blockHash)
        const block = await web3BNBTestnet.eth.getBlock(burnReceipt.blockNumber);
        console.log("Oracle started on Görli")
        console.log("burn transaction on BNBTestnet")
        while(providerBNBTestnet.getBlockNumber()-block.blockNumber < 12){}
        if(block.transactions[burnReceipt.transactionIndex] == blockHash && burnReceipt.status == true){
            transactionVerified = true;
        }
        else{
            console.log("transaction not contained in block")
            return;
        }
    }
    console.log(JSON.stringify(blockHash, null, 4))
    if(map.get(blockHash) == true){
        return;
    }
    map.set(blockHash, true);
    await oracleContractGoerli.fromOracle(transactionVerified, blockHash);
    console.log("Response sent (Görli)");
}

async function startOracleBNBTestnet(blockHash, chainID){
    if(chainID == 5){
        console.log("Oracle started on BNBTestnet")
        console.log("burn transaction on Görli")
        const burnReceipt = await web3.eth.getTransactionReceipt(blockHash)
        const block = await web3.eth.getBlock(burnReceipt.blockNumber);
        while(provider.getBlockNumber()-block.blockNumber < 12){}
        if(block.transactions[burnReceipt.transactionIndex] == blockHash && burnReceipt.status == true){
            transactionVerified = true;
        }
        else{
            console.log("transaction not contained in block")
            return;
        }
    }
    else if(chainID == 97){
        console.log("Oracle started on BNBTestnet")
        console.log("burn transaction on BNBTestnet")
        const burnReceipt = await web3BNBTestnet.eth.getTransactionReceipt(blockHash)
        const block = await web3BNBTestnet.eth.getBlock(burnReceipt.blockNumber);
        while(provider.getBlockNumber()-block.blockNumber < 12){}
        if(block.transactions[burnReceipt.transactionIndex] == blockHash && burnReceipt.status == true){
            transactionVerified = true;
        }
        else{
            console.log("transaction not contained in block")
            return;
        }
    }
    console.log(JSON.stringify(blockHash, null, 4))
    if(map.get(blockHash) == true){
        return;
    }
    map.set(blockHash, true);
    await oracleContractBNBTestnet.fromOracle(transactionVerified, blockHash);
    console.log("Response sent (BNBTestnet)");
    transactionVerified = false;
}