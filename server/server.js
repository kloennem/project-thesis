const Web3 = require("web3")
const ethers = require("ethers")
const express = require('express');
const cors = require('cors');

const RLP = require('rlp');
const { BaseTrie: Trie } = require('merkle-patricia-tree');
const {
    asyncTriePut,
    newTrie,
    createRLPHeader,
    createRLPTransaction,
    createRLPReceipt,
    encodeToBuffer
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
                "internalType": "uint256",
                "name": "stake",
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
            },
            {
                "internalType": "bytes32",
                "name": "txHash",
                "type": "bytes32"
            }
        ],
        "name": "confirm",
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

let burnResult;
let executed;

const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23'));
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", provider)

const protocol2AddressSrcGoerli = "0x1c6dFBa8F90d3258328D223FCFa2FB42DC05Fb42"
const protocol2AddressDestGoerli = "0x21d367a7618bE5883916c3030094236B9Ce48405"
const verifierAddressGoerli = "0x6fa64A3fBeD62945F17301f1330a769262f236e5"

const transferContractSrc = new ethers.Contract(protocol2AddressSrcGoerli, Protocol2, signer);
const transferContractDest = new ethers.Contract(protocol2AddressDestGoerli, Protocol2, signer);
const verifierContract = new ethers.Contract(verifierAddressGoerli, OracleTxInclusionVerifier, signer);

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});

app.post('/postBurn', (req, res) => {
    console.log(req.body.reqStruct);
    console.log(req.body.signature);
    burnTokens(req.body.reqStruct, req.body.signature);
    console.log("burnTokens called");
    res.json({ message: "burn forwarded" });
});

const burnTokens = async (reqStruct, signature) => {
    executed = false;
    const message = ethers.utils.arrayify(ethers.utils.solidityKeccak256(['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes', 'address', 'address', 'uint', 'uint'], [reqStruct.from, reqStruct.to, reqStruct.value, reqStruct.gas, reqStruct.nonce, reqStruct.fun, reqStruct.recAddress, reqStruct.targetContract, reqStruct.amount, reqStruct.stake]))
    const messageVerified = await ethers.utils.verifyMessage(message, signature)
    if (messageVerified.toLowerCase() == reqStruct.from) {
        console.log("signature verification successful")
        burnResult = await transferContractSrc.burn(reqStruct.recAddress, reqStruct.targetContract, reqStruct.amount, reqStruct.stake, reqStruct.from, { gasLimit: 5000000 });
        await burnResult.wait();
        console.log("forwarded burn hash " + burnResult.hash);
    }
    else {
        console.log("signature verification not successful")
    }
};

transferContractSrc.on("Burn", async (from, to, contract, value) => {
    console.log("burn event caught");
    await verifierContract.startOracle(burnResult.hash)
});

verifierContract.on("OraclePositive", async (currentHash) => {
    console.log("oraclePositive event caught")
    claimTokens();
});

const claimTokens = async (t) => {
    let burnReceipt = await web3.eth.getTransactionReceipt(burnResult.hash)
    while (burnReceipt === null && executed === false) {
        executed = true;
        burnReceipt = await web3.eth.getTransactionReceipt(burnResult.hash)
    }
    console.log("executed worked")
    const block = await web3.eth.getBlock(burnReceipt.blockNumber);
    const tx = await web3.eth.getTransaction(burnResult.hash);
    const txReceipt = await web3.eth.getTransactionReceipt(burnResult.hash);
    const rlpHeader = createRLPHeader(block);
    tx.value = (ethers.BigNumber.from(tx.value)).toString();
    tx.gasPrice = (ethers.BigNumber.from(tx.gasPrice)).toString();
    const rlpEncodedTx = createRLPTransaction(tx);
    const rlpEncodedReceipt = createRLPReceipt(txReceipt);

    const path = encodeToBuffer(tx.transactionIndex);
    const rlpEncodedTxNodes = await createTxMerkleProof(block, tx.transactionIndex);
    const rlpEncodedReceiptNodes = await createReceiptMerkleProof(block, tx.transactionIndex);

    console.log("before claim")
    const claimResult = await transferContractDest.claim(rlpHeader, rlpEncodedTx, rlpEncodedReceipt, rlpEncodedTxNodes, rlpEncodedReceiptNodes, path, burnResult.hash, { gasLimit: 5000000 });
    await claimResult.wait();
    console.log("after claim")
};

const createTxMerkleProof = async (block, transactionIndex) => {
    const trie = newTrie();

    for (let i = 0; i < block.transactions.length; i++) {
        const tx = await provider.getTransaction(block.transactions[i]);
        tx.value = (ethers.BigNumber.from(tx.value)).toString();
        tx.gasPrice = (ethers.BigNumber.from(tx.gasPrice)).toString();
        const rlpTx = createRLPTransaction(tx);
        const key = RLP.encode(i);
        await asyncTriePut(trie, key, rlpTx);
    }

    const key = RLP.encode(transactionIndex);
    return encodeToBuffer(await Trie.createProof(trie, key));
};

const createReceiptMerkleProof = async (block, transactionIndex) => {
    const trie = newTrie();

    for (let i = 0; i < block.transactions.length; i++) {
        const receipt = await web3.eth.getTransactionReceipt(block.transactions[i]);
        const rlpReceipt = createRLPReceipt(receipt);
        const key = RLP.encode(i);
        await asyncTriePut(trie, key, rlpReceipt);
    }

    const key = RLP.encode(transactionIndex);
    return encodeToBuffer(await Trie.createProof(trie, key));
};