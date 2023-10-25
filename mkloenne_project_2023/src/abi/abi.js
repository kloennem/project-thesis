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
export const Ethrelay = [
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_rlpHeader",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "totalDifficulty",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ethashContractAddr",
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
          "indexed": false,
          "internalType": "uint256",
          "name": "returnCode",
          "type": "uint256"
        }
      ],
      "name": "DisputeBlock",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "blockHash",
          "type": "bytes32"
        }
      ],
      "name": "NewBlock",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "returnCode",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "errorInfo",
          "type": "uint256"
        }
      ],
      "name": "PoWValidationResult",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "root",
          "type": "bytes32"
        }
      ],
      "name": "RemoveBranch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "withdrawnStake",
          "type": "uint256"
        }
      ],
      "name": "WithdrawStake",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getGenesisBlockHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "blockHash",
          "type": "bytes32"
        }
      ],
      "name": "getHeader",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "blockNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalDifficulty",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getLongestChainEndpoint",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "name": "isHeaderStored",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositStake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawStake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStake",
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
      "name": "getRequiredStakePerBlock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getRequiredVerificationFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getBlockHashesSubmittedByClient",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "rlpHeader",
          "type": "bytes"
        }
      ],
      "name": "submitBlock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_rlpHeaders",
          "type": "bytes"
        }
      ],
      "name": "submitBlockBatch",
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
          "name": "rlpParent",
          "type": "bytes"
        },
        {
          "internalType": "uint256[]",
          "name": "dataSetLookup",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "witnessForLookup",
          "type": "uint256[]"
        }
      ],
      "name": "disputeBlockHeader",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "type": "function",
      "payable": true
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
      "type": "function",
      "payable": true
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
      "type": "function",
      "payable": true
    },
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
          "internalType": "uint8",
          "name": "noOfConfirmations",
          "type": "uint8"
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
    }
  ]
export const Verilay = [
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_signatureThreshold",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_trustingPeriod",
          "type": "uint64"
        },
        {
          "internalType": "bytes32",
          "name": "_finalizedBlockRoot",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_finalizedStateRoot",
          "type": "bytes32"
        },
        {
          "internalType": "uint64",
          "name": "_finalizedSlot",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_latestSlot",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "_latestSlotWithValidatorSetChange",
          "type": "uint64"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[512]",
          "name": "_currentValidatorSet",
          "type": "bytes[512]"
        },
        {
          "internalType": "bytes",
          "name": "_currentValidatorSetAggregate",
          "type": "bytes"
        }
      ],
      "name": "initializeCurrent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[512]",
          "name": "_nextValidatorSet",
          "type": "bytes[512]"
        },
        {
          "internalType": "bytes",
          "name": "_nextValidatorSetAggregate",
          "type": "bytes"
        }
      ],
      "name": "initializeNext",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLatestSlotWithValidatorSetChange",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getFinalizedBlockRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getFinalizedStateRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            },
            {
              "internalType": "bool[512]",
              "name": "participants",
              "type": "bool[512]"
            },
            {
              "internalType": "bytes32",
              "name": "latestBlockRoot",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "signingDomain",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "latestSlot",
              "type": "uint64"
            },
            {
              "internalType": "bytes32[]",
              "name": "latestSlotBranch",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes32",
              "name": "finalizedBlockRoot",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32[]",
              "name": "finalizingBranch",
              "type": "bytes32[]"
            },
            {
              "internalType": "uint64",
              "name": "finalizedSlot",
              "type": "uint64"
            },
            {
              "internalType": "bytes32[]",
              "name": "finalizedSlotBranch",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes32",
              "name": "finalizedStateRoot",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32[]",
              "name": "finalizedStateRootBranch",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes32",
              "name": "stateRoot",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32[]",
              "name": "stateRootBranch",
              "type": "bytes32[]"
            }
          ],
          "internalType": "struct ChainRelayUpdate",
          "name": "_chainRelayUpdate",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes[512]",
              "name": "nextNextValidatorSet",
              "type": "bytes[512]"
            },
            {
              "internalType": "bytes",
              "name": "nextNextValidatorSetAggregate",
              "type": "bytes"
            },
            {
              "internalType": "bytes32[]",
              "name": "nextNextValidatorSetBranch",
              "type": "bytes32[]"
            }
          ],
          "internalType": "struct SyncCommitteeUpdate",
          "name": "_syncCommitteeUpdate",
          "type": "tuple"
        }
      ],
      "name": "submitUpdate",
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
          "internalType": "bytes[512]",
          "name": "_pubkeys",
          "type": "bytes[512]"
        },
        {
          "internalType": "bool[512]",
          "name": "_isActive",
          "type": "bool[512]"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfActive",
          "type": "uint256"
        }
      ],
      "name": "getActiveValidators",
      "outputs": [
        {
          "internalType": "bytes[]",
          "name": "",
          "type": "bytes[]"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bool[512]",
          "name": "_bools",
          "type": "bool[512]"
        }
      ],
      "name": "countTrueBools",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_message",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        },
        {
          "internalType": "bytes[]",
          "name": "_pubkeys",
          "type": "bytes[]"
        }
      ],
      "name": "serializeAggregateSignature",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_input",
          "type": "bytes"
        }
      ],
      "name": "fastAggregateVerify",
      "outputs": [
        {
          "internalType": "bool",
          "name": "o",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_slot",
          "type": "uint256"
        }
      ],
      "name": "slotToUnixTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_input",
          "type": "bytes32"
        }
      ],
      "name": "bytes32ToBytes",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "output",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes2",
          "name": "_input",
          "type": "bytes2"
        }
      ],
      "name": "bytes2ToBytes",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "output",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_left",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_right",
          "type": "bytes32"
        }
      ],
      "name": "concat",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_left",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_right",
          "type": "bytes32"
        }
      ],
      "name": "hashTreeRootPair",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_blspubkey",
          "type": "bytes"
        }
      ],
      "name": "hashTreeRootBlspubkey",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_blockRoot",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_signingDomain",
          "type": "bytes32"
        }
      ],
      "name": "computeSigningRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_input",
          "type": "bytes"
        }
      ],
      "name": "bytesToBytes8",
      "outputs": [
        {
          "internalType": "bytes8",
          "name": "result",
          "type": "bytes8"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_input",
          "type": "bytes"
        }
      ],
      "name": "bytesToBytes32",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "result",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes8",
          "name": "_input",
          "type": "bytes8"
        }
      ],
      "name": "revertBytes8",
      "outputs": [
        {
          "internalType": "bytes8",
          "name": "",
          "type": "bytes8"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_input",
          "type": "uint64"
        }
      ],
      "name": "merklelizeSlot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_input",
          "type": "uint256"
        }
      ],
      "name": "bitLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_input",
          "type": "uint256"
        }
      ],
      "name": "nextPowOfTwo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_input",
          "type": "uint256"
        }
      ],
      "name": "floorLog2",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32[512]",
          "name": "_chunks",
          "type": "bytes32[512]"
        }
      ],
      "name": "merkleize",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes[512]",
          "name": "_syncCommittee",
          "type": "bytes[512]"
        },
        {
          "internalType": "bytes",
          "name": "_syncAggregate",
          "type": "bytes"
        }
      ],
      "name": "hashTreeRootSyncCommittee",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_generalizedIndex",
          "type": "uint256"
        }
      ],
      "name": "getSubtreeIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_root",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_leaf",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_generalizedIndex",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "_branch",
          "type": "bytes32[]"
        }
      ],
      "name": "validateMerkleBranch",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    }
  ]