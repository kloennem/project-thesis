// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract OracleTxInclusionVerifier{

    bytes32[20] currentBurnBlockHash;
    mapping(bytes32 => uint) blockHashIndex;

    mapping(bytes32 => bool) verifyTxResult;
    mapping(bytes32 => bool) verifyReceiptResult;
    mapping(bytes32 => bool) blockConfirmationResult;

    uint verifyTxResultCounter = 0;
    uint verifyReceiptCounter = 0;
    uint blockConfirmationResultCounter = 0;

    address[10] oracles;

    constructor(address[10] memory _oracles) {
        oracles = _oracles;
    }

    function startOracle(bytes32 _currentBurnBlockHash) public {
        for(uint i=1; i<=20; i++){
            if(currentBurnBlockHash[i] == 0){
                currentBurnBlockHash[i] = _currentBurnBlockHash;
                blockHashIndex[_currentBurnBlockHash] = i;
                emit StartOracle(_currentBurnBlockHash);
                break;
            }
        }
        if(blockHashIndex[_currentBurnBlockHash]==0){
            emit StartFailed(_currentBurnBlockHash);
        }
    }

    function fromOracle(bool _verifyTxResult, bool _verifyReceiptResult, bool _blockConfirmationResult, bytes32 _currentBurnBlockHash) public {
        bytes32 index = currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]];
        for(uint i=1; i<10; i++){
            if(msg.sender == oracles[i]){
                if(_verifyTxResult == true){
                    verifyTxResultCounter++;
                }
                if(_verifyReceiptResult == true){
                    verifyReceiptCounter++;
                }
                if(_blockConfirmationResult == true){
                    blockConfirmationResultCounter++;
                }
                break;
            }
        }
        if(verifyTxResultCounter>=1&&verifyTxResult[index]!=true){
            verifyTxResult[index] = true;
        }
        if(verifyReceiptCounter>=1&&verifyReceiptResult[index]!=true){
            verifyReceiptResult[index] = true;
        }
        if(blockConfirmationResultCounter>=1&&blockConfirmationResult[index]!=true){
            blockConfirmationResult[index] = true;
        }
        if(verifyTxResult[index]&&verifyReceiptResult[index]&&blockConfirmationResult[index]){
            currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]] = 0;
            emit OraclePositive(index);
        }
    }

    function isBlockConfirmed(uint /*feeInWei*/, bytes32 /*blockHash*/, uint /*requiredConfirmations*/, bytes32 _currentBurnBlockHash) payable public returns (bool) {
        return blockConfirmationResult[currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]]];
    }

    function verifyTransaction(uint /*feeInWei*/, bytes memory /*rlpHeader*/, uint8 /*noOfConfirmations*/, bytes memory /*rlpEncodedTx*/,
        bytes memory /*path*/, bytes memory /*rlpEncodedNodes*/, bytes32 _currentBurnBlockHash) payable public returns (bool) {
        return verifyTxResult[currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]]];
    }

    function verifyReceipt(uint /*feeInWei*/, bytes memory /*rlpHeader*/, uint8 /*noOfConfirmations*/, bytes memory /*rlpEncodedReceipt*/,
        bytes memory /*path*/, bytes memory /*rlpEncodedNodes*/, bytes32 _currentBurnBlockHash) payable public returns (bool) {
        return verifyReceiptResult[currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]]];
    }

    function verifyState(uint /*feeInWei*/, bytes memory /*rlpHeader*/, uint8 /*noOfConfirmations*/, bytes memory /*rlpEncodedState*/,
        bytes memory /*path*/, bytes memory /*rlpEncodedNodes*/) payable public returns (uint8) {
        return 0;
    }

    event StartOracle(bytes32 indexed burnBlockHash);
    event OraclePositive(bytes32 indexed burnBlockHash);
    event StartFailed(bytes32 indexed burnBlockHash);
}
