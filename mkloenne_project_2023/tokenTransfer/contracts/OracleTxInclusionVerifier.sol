// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract OracleTxInclusionVerifier{

    bytes32[20] currentBurnBlockHash;
    mapping(bytes32 => uint) blockHashIndex;

    mapping(bytes32 => bool) verifyTxResult;
    uint[20] verifyTxResultCounter;

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

    function fromOracle(bool _verifyTxResult, bytes32 _currentBurnBlockHash) public {
        for(uint i=0; i<10; i++){
            if(msg.sender == oracles[i] && oracleAlreadyVoted[_currentBurnBlockHash][i] == false){
                if(_verifyTxResult == true){
                    verifyTxResultCounter[blockHashIndex[_currentBurnBlockHash]]++;
                }
                oracleAlreadyVoted[_currentBurnBlockHash][i] = true;
                break;
            }
        }
        if(verifyTxResultCounter[blockHashIndex[_currentBurnBlockHash]]>=1&&verifyTxResult[_currentBurnBlockHash]!=true){
            verifyTxResult[_currentBurnBlockHash] = true;
        }
        if(verifyTxResult[_currentBurnBlockHash]){
            verifyTxResultCounter[blockHashIndex[_currentBurnBlockHash]] = 0;
            currentBurnBlockHash[blockHashIndex[_currentBurnBlockHash]] = 0;
            emit OraclePositive(_currentBurnBlockHash);
        }
    }

    function verifyTransaction(bytes32 _currentBurnBlockHash) payable public returns (bool) {
        return verifyTxResult[_currentBurnBlockHash];
    }

    event StartOracle(bytes32 indexed burnBlockHash, uint chainID);
    event OraclePositive(bytes32 indexed burnBlockHash);
    event StartFailed(bytes32 indexed burnBlockHash);
}
