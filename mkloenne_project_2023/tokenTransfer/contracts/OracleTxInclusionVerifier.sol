// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract OracleTxInclusionVerifier{

    bytes32[20] currentBurnBlockHash;
    mapping(bytes32 => uint) blockHashIndex;

    mapping(bytes32 => bool) verifyTxResult;
    mapping(bytes32 => bool) verifyReceiptResult;
    mapping(bytes32 => bool) blockConfirmationResult;

    uint[20] verifyTxResultCounter;
    uint[20] verifyReceiptCounter;
    uint[20] blockConfirmationResultCounter;

    address[10] oracles;
    mapping(bytes32 => bool[10]) oracleAlreadyVoted;

    constructor(address[10] memory _oracles) {
        oracles = _oracles;
    }

    function startOracle(bytes32 _currentBurnBlockHash, uint _chainID) public {
        for(uint i=0; i<20; i++){
            if(currentBurnBlockHash[i] == 0){
                currentBurnBlockHash[i] = _currentBurnBlockHash;
                blockHashIndex[_currentBurnBlockHash] = i;
                emit StartOracle(_currentBurnBlockHash, _chainID);
                return;
            }
        }
        if(blockHashIndex[_currentBurnBlockHash]==0){
            emit StartFailed(_currentBurnBlockHash);
        }
    }

    function fromOracle(bool _verifyTxResult, bool _verifyReceiptResult, bool _blockConfirmationResult, bytes32 _currentBurnBlockHash) public {
        for(uint i=0; i<10; i++){
            if(msg.sender == oracles[i] && oracleAlreadyVoted[_currentBurnBlockHash][i] == false){
                if(_verifyTxResult == true){
                    verifyTxResultCounter[blockHashIndex[_currentBurnBlockHash]]++;
                }
                if(_verifyReceiptResult == true){
                    verifyReceiptCounter[blockHashIndex[_currentBurnBlockHash]]++;
                }
                if(_blockConfirmationResult == true){
                    blockConfirmationResultCounter[blockHashIndex[_currentBurnBlockHash]]++;
                }
                oracleAlreadyVoted[_currentBurnBlockHash][i] = true;
                break;
            }
        }
        if(verifyTxResultCounter[blockHashIndex[_currentBurnBlockHash]]>=1&&verifyTxResult[_currentBurnBlockHash]!=true){
            verifyTxResult[_currentBurnBlockHash] = true;
        }
        if(verifyReceiptCounter[blockHashIndex[_currentBurnBlockHash]]>=1&&verifyReceiptResult[_currentBurnBlockHash]!=true){
            verifyReceiptResult[_currentBurnBlockHash] = true;
        }
        if(blockConfirmationResultCounter[blockHashIndex[_currentBurnBlockHash]]>=1&&blockConfirmationResult[_currentBurnBlockHash]!=true){
            blockConfirmationResult[_currentBurnBlockHash] = true;
        }
        if(verifyTxResult[_currentBurnBlockHash]&&verifyReceiptResult[_currentBurnBlockHash]&&blockConfirmationResult[_currentBurnBlockHash]){
            verifyTxResultCounter[blockHashIndex[_currentBurnBlockHash]] = 0;
            verifyReceiptCounter[blockHashIndex[_currentBurnBlockHash]] = 0;
            blockConfirmationResultCounter[blockHashIndex[_currentBurnBlockHash]] = 0;
            currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]] = 0;
            emit OraclePositive(_currentBurnBlockHash);
        }
    }

    function verifyTransaction(uint /*feeInWei*/, bytes memory /*rlpHeader*/, uint8 /*noOfConfirmations*/, bytes memory /*rlpEncodedTx*/,
        bytes memory /*path*/, bytes memory /*rlpEncodedNodes*/, bytes32 _currentBurnBlockHash) payable public returns (bool) {
        return verifyTxResult[_currentBurnBlockHash];
    }

    function verifyReceipt(uint /*feeInWei*/, bytes memory /*rlpHeader*/, uint8 /*noOfConfirmations*/, bytes memory /*rlpEncodedReceipt*/,
        bytes memory /*path*/, bytes memory /*rlpEncodedNodes*/, bytes32 _currentBurnBlockHash) payable public returns (bool) {
            return verifyReceiptResult[_currentBurnBlockHash];
    }

    function isBlockConfirmed(uint /*feeInWei*/, bytes32 /*blockHash*/, uint /*requiredConfirmations*/, bytes32 _currentBurnBlockHash) payable public returns (bool) {
        return blockConfirmationResult[_currentBurnBlockHash];
    }

    function verifyState(uint /*feeInWei*/, bytes memory /*rlpHeader*/, uint8 /*noOfConfirmations*/, bytes memory /*rlpEncodedState*/,
        bytes memory /*path*/, bytes memory /*rlpEncodedNodes*/) payable public returns (uint8) {
        return 0;
    }

    function getCurrentBurnBlockHashes() public view returns (bytes32[20] memory) {
        return currentBurnBlockHash;
    }

    function getCurrentCounter() public view returns (uint[20] memory _verifyTxResultCounter, uint[20] memory _verifyReceiptCounter,uint[20] memory _blockConfirmationResultCounter) {
        return (verifyTxResultCounter, verifyReceiptCounter, blockConfirmationResultCounter);
    }

    event StartOracle(bytes32 indexed burnBlockHash, uint chainID);
    event OraclePositive(bytes32 indexed burnBlockHash);
    event StartFailed(bytes32 indexed burnBlockHash);
}
