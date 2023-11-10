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
      "type": "function",
      "payable": true
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
      "type": "function",
      "payable": true
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
      "type": "function",
      "payable": true
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
      "type": "function",
      "payable": true
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
      "type": "function",
      "constant": true
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
      "type": "function",
      "constant": true
    }
  ]
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
    }
    ],
    "name": "set",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "get",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
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
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
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
        "internalType": "bytes",
        "name": "rlpMerkleProofTx",
        "type": "bytes"
    },
    {
        "internalType": "bytes",
        "name": "rlpMerkleProofReceipt",
        "type": "bytes"
    },
    {
        "internalType": "bytes",
        "name": "path",
        "type": "bytes"
    }
    ],
    "name": "claim",
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
        "internalType": "bytes",
        "name": "rlpMerkleProofTx",
        "type": "bytes"
    },
    {
        "internalType": "bytes",
        "name": "rlpMerkleProofReceipt",
        "type": "bytes"
    },
    {
        "internalType": "bytes",
        "name": "path",
        "type": "bytes"
    }
    ],
    "name": "confirm",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "rlpTransaction",
        "type": "bytes"
    }
    ],
    "name": "tester",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}
]

const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23'));

const provider = new ethers.providers.Web3Provider(web3.currentProvider);
// provider.send("eth_requestAccounts", []);
// const signer = provider.getSigner();
const signer = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", provider)

const verifierAddressGoerli = "0x347B35b8813a8DE2AB4caa5f0DbbFcB374C13549"

const verifierAddressBNBTestnet = "0xa0cff663BaD972fD5a433Fc7F023FD7f4aD8E60c"

const verifierContract = new ethers.Contract(verifierAddressGoerli, OracleTxInclusionVerifier, signer);

let blockConfirmed = false;
let transactionVerified = false;
let receiptVerified = false;

start();

async function start(){
        console.log("Start")
        verifierContract.on("StartOracle", async (blockHash)=>{
            
            console.log(JSON.stringify(blockHash, null, 4))
            await question1();
            await question2();
            await question3();
            await verifierContract.fromOracle(transactionVerified, receiptVerified, blockConfirmed, blockHash);
            console.log("Response sent");
        })
}


const question1 = () => {
    return new Promise((resolve, reject) => {
        readline.question('Do you want to verify that the block is confirmed? (y/n)', verifyBlock => {
            if(verifyBlock == "y"){
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
            if(verifyTransaction == "y"){
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
            if(verifyReceipt == "y"){
                receiptVerified = true;
            }
            console.log(`Block Confirmed: ${receiptVerified}`);
            resolve()
        })
    })
}
// 0xf2a8b9b388fe1419e457a28f13bd497dd1e9b6ee4c91534591d6cbe874593dbd

// 0x595e05ac15ac41a3c15342fec3f4032db79418f7fff4377f2bd147f2cd19572b,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000000000000000000000000000

// 0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
// 0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
// 0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0