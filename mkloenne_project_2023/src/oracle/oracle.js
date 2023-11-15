const Web3 = require("web3")
const ethers = require("ethers")
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

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
                "internalType": "bool",
                "name": "_verifyReceiptResult",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "_blockConfirmationResult",
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
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
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
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "_currentBurnBlockHash",
                "type": "bytes32"
            }
        ],
        "name": "verifyReceipt",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "_currentBurnBlockHash",
                "type": "bytes32"
            }
        ],
        "name": "isBlockConfirmed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "verifyState",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentBurnBlockHashes",
        "outputs": [
            {
                "internalType": "bytes32[20]",
                "name": "",
                "type": "bytes32[20]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentCounter",
        "outputs": [
            {
                "internalType": "uint256[20]",
                "name": "_verifyTxResultCounter",
                "type": "uint256[20]"
            },
            {
                "internalType": "uint256[20]",
                "name": "_verifyReceiptCounter",
                "type": "uint256[20]"
            },
            {
                "internalType": "uint256[20]",
                "name": "_blockConfirmationResultCounter",
                "type": "uint256[20]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23'));
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", provider)

const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");
const signerBNBTestnet = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerBNBTestnet)

const oracleAddressGoerli = "0x6fa64A3fBeD62945F17301f1330a769262f236e5"

const oracleAddressBNBTestnet = "0x9dCa11eF2C1F6E958e2B0bfcACe319a55a7C6D40"

const oracleContractGoerli = new ethers.Contract(oracleAddressGoerli, OracleTxInclusionVerifier, signer);
const oracleContractBNBTestnet = new ethers.Contract(oracleAddressBNBTestnet, OracleTxInclusionVerifier, signerBNBTestnet);

let blockConfirmed = false;
let transactionVerified = false;
let receiptVerified = false;

start();

async function start() {
    console.log("Start")
    oracleContractGoerli.on("StartOracle", async (blockHash) => {
        console.log(JSON.stringify(blockHash, null, 4))
        await question1();
        await question2();
        await question3();
        await oracleContractGoerli.fromOracle(transactionVerified, receiptVerified, blockConfirmed, blockHash);
        console.log("Response sent (Görli)");
    })

    oracleContractBNBTestnet.on("StartOracle", async (blockHash) => {
        console.log(JSON.stringify(blockHash, null, 4))
        await question1();
        await question2();
        await question3();
        await oracleContractBNBTestnet.fromOracle(transactionVerified, receiptVerified, blockConfirmed, blockHash);
        console.log("Response sent (BNBTestnet)");
    })
}


const question1 = () => {
    return new Promise((resolve, reject) => {
        readline.question('Do you want to verify that the block is confirmed? (y/n)', verifyBlock => {
            if (verifyBlock == "y") {
                blockConfirmed = true;
            }
            console.log(`Block confirmed: ${blockConfirmed}`);
            resolve();
        })
    })
}
const question2 = () => {
    return new Promise((resolve, reject) => {
        readline.question('Do you want to verify the transaction? (y/n)', verifyTransaction => {
            if (verifyTransaction == "y") {
                transactionVerified = true;
            }
            console.log(`Transaction verified: ${transactionVerified}`);
            resolve()
        })
    })
}
const question3 = () => {
    return new Promise((resolve, reject) => {
        readline.question('Do you want to verify the receipt? (y/n)', verifyReceipt => {
            if (verifyReceipt == "y") {
                receiptVerified = true;
            }
            console.log(`Receipt verified: ${receiptVerified}`);
            resolve()
        })
    })
}

