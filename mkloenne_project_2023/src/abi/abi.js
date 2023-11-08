// todo: add abi from JSON file after migration
export const Protocol2 = [
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
export const TxInclusionVerifier = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "feeInWei",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "blockHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "requiredConfirmations",
          "type": "uint256"
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
          "name": "feeInWei",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "rlpHeader",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "noOfConfirmations",
          "type": "uint8"
        },
        {
          "internalType": "bytes",
          "name": "rlpEncodedTx",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "path",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "rlpEncodedNodes",
          "type": "bytes"
        }
      ],
      "name": "verifyTransaction",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "feeInWei",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "rlpHeader",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "noOfConfirmations",
          "type": "uint8"
        },
        {
          "internalType": "bytes",
          "name": "rlpEncodedReceipt",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "path",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "rlpEncodedNodes",
          "type": "bytes"
        }
      ],
      "name": "verifyReceipt",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "feeInWei",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "rlpHeader",
          "type": "bytes"
        },
        {
          "internalType": "uint8",
          "name": "noOfConfirmations",
          "type": "uint8"
        },
        {
          "internalType": "bytes",
          "name": "rlpEncodedState",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "path",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "rlpEncodedNodes",
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
    }
  ]
