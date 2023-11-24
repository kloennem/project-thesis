// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./RLPReader.sol";
import "./OracleTxInclusionVerifier.sol";

contract TransferContract is ERC20 {
    using RLPReader for RLPReader.RLPItem;
    using RLPReader for RLPReader.Iterator;
    using RLPReader for bytes;

    struct ClaimData {
        address burnContract;           // the contract which has burnt the tokens on the other blockchian
        address sender;                 // sender on the burn token contract
        address recipient;              // recipient on the destination token contract
        address claimContract;          // address of the contract that should process the claim tx
        uint value;                     // the value to create on this chain
        bool isBurnValid;               // indicates whether the burning of tokens has taken place (didn't abort, e.g., due to require statement)
        uint burnTime;                  // specifies the block number of the block containing the burn tx
    }

    OracleTxInclusionVerifier txInclusionVerifier;
    mapping(bytes32 => bool) claimedTransactions;
    mapping(bytes32 => bool) confirmedClaimTransactions;
    uint chainIdentifier;
    mapping(address => bool) participatingTokenContracts; // addresses of the token contracts living on other blockchains
    uint8 constant TRANSFER_FEE = 10; // 1/10 of the transfer amount

    uint fee;
    address immutable masterAddress;
    bytes rlpEncodedTx;

    constructor(
        address[] memory tokenContracts,
        address txInclVerifier,
        uint initialSupply,
        address _masterAddress
    ) ERC20("TestToken", "TKN") {
        for (uint i = 0; i < tokenContracts.length; i++) {
            participatingTokenContracts[tokenContracts[i]] = true;
        }
        txInclusionVerifier = OracleTxInclusionVerifier(txInclVerifier);
        masterAddress = _masterAddress;
        _mint(msg.sender, initialSupply);
    }

    // For simplicity, use this function to register further token contracts.
    // This has obvious security implications as any one is able to change this address -> do not use it in production.
    function registerTokenContract(address tokenContract) public {
        require(
            msg.sender == masterAddress,
            "sender is not permitted to register token contracts"
        );
        require(
            tokenContract != address(0),
            "contract address must not be zero address"
        );
        participatingTokenContracts[tokenContract] = true;
    }

    function burn(
        address recipient,
        address claimContract,
        uint value,
        address sender
    ) public {
        require(
            recipient != address(0),
            "recipient address must not be zero address"
        );
        require(
            participatingTokenContracts[claimContract] == true,
            "claim contract address is not registered"
        );
        _burn(sender, value);
        emit Burn(sender, recipient, claimContract, value);
    }

    function claim(
        bytes memory rlpHeader,                 // rlp-encoded header of the block containing burn tx along with its receipt
        bytes calldata serializedTx,            // serialized burn tx
        bytes calldata serializedReceipt,       // serialized receipt of burn tx (burn receipt)
        bytes32 txHash                          // hash of burn tx
    ) public {
        require(
            claimedTransactions[keccak256(serializedTx)] == false,
            "tokens have already been claimed"
        );

        rlpEncodedTx = extractRLPEncoding(serializedTx);
        ClaimData memory c = extractClaim(
            rlpHeader,
            rlpEncodedTx,
            extractRLPEncoding(serializedReceipt)
        );

        // check pre-conditions
        require(
            participatingTokenContracts[c.burnContract] == true,
            "burn contract address is not registered"
        );
        require(
            c.claimContract == address(this),
            "this contract has not been specified as destination token contract"
        );
        require(
            c.isBurnValid == true,
            "burn transaction was not successful (e.g., require statement was violated)"
        );

        // verify inclusion of burn transaction
        require(
            txInclusionVerifier.verifyTransaction(txHash) == true,
            "burn transaction does not exist or has not enough confirmations"
        );

        fee = calculateFee(c.value, TRANSFER_FEE);
        uint remainingValue = c.value - fee;
        address feeRecipient = c.recipient;

        if (msg.sender != c.recipient) {
            // other client wants to claim fees
            // fair claim period has elapsed -> fees go to msg.sender
            feeRecipient = msg.sender;
        }

        // mint fees to feeRecipient
        _mint(feeRecipient, fee);
        // mint remaining value to recipient
        _mint(c.recipient, remainingValue);

        claimedTransactions[keccak256(serializedTx)] = true; // IMPORTANT: prevent this tx from being used for further claims
        emit Claim(c.burnContract, c.sender, c.burnTime);
    }

    function extractClaim(
        bytes memory rlpHeader,
        bytes memory rlpTransaction,
        bytes memory rlpReceipt
    ) private pure returns (ClaimData memory) {
        ClaimData memory c;

        // get burn time
        c.burnTime = getBlockNumber(rlpHeader);

        // parse transaction
        RLPReader.RLPItem[] memory transaction = rlpTransaction
            .toRlpItem()
            .toList();
        uint8 idx;

        if (transaction.length == 12) {
            // EIP-1559
            idx = 5;
        } else if (transaction.length == 11) {
            // EIP-2930
            idx = 4;
        } else if (transaction.length == 9) {
            // legacy
            idx = 3;
        } else {
            revert("invalid length of RLP transaction");
        }
        c.burnContract = transaction[idx].toAddress();

        // parse receipt
        RLPReader.RLPItem[] memory receipt = rlpReceipt.toRlpItem().toList();
        c.isBurnValid = receipt[0].toBoolean();

        // read logs
        RLPReader.RLPItem[] memory logs = receipt[3].toList();
        RLPReader.RLPItem[] memory burnEventTuple = logs[1].toList(); // logs[0] contains the transfer events emitted by the ECR20 method _burn
        RLPReader.RLPItem[] memory burnEventTopics = burnEventTuple[1].toList(); // topics contain all indexed event fields

        // read value and recipient from burn event
        c.sender = address(uint160(burnEventTopics[1].toUint())); // indices of indexed fields start at 1 (0 is reserved for the hash of the event signature)
        c.recipient = address(uint160(burnEventTopics[2].toUint()));
        c.claimContract = address(uint160(burnEventTopics[3].toUint()));
        c.value = burnEventTuple[2].toUint();

        return c;
    }

    function getBlockNumber(
        bytes memory rlpHeader
    ) private pure returns (uint) {
        RLPReader.Iterator memory it = rlpHeader.toRlpItem().iterator();
        uint idx = 0;
        while (it.hasNext()) {
            if (idx == 8) {
                return it.next().toUint();
            }
            it.next();
            idx++;
        }

        return 0;
    }

    /**
     * @dev Divides amount by divisor and returns the integer result. If the remainder is greater than 0,
     *      the result is incremented by 1 (rounded up).
     */
    function calculateFee(
        uint amount,
        uint divisor
    ) private pure returns (uint) {
        uint result = amount / divisor;
        uint remainder = amount % divisor;

        if (remainder > 0) {
            // round towards next integer
            return result + 1;
        } else {
            return result;
        }
    }

    function extractRLPEncoding(
        bytes calldata serialized
    ) private pure returns (bytes memory) {
        bytes1 firstByte = serialized[0];
        if (firstByte == hex"01" || firstByte == hex"02") {
            return serialized[1:];
        }
        return serialized;
    }

    event Burn(
        address indexed sender,
        address indexed recipient,
        address indexed claimContract,
        uint value
    );
    event Claim(
        address indexed burnContract,
        address indexed sender,
        uint indexed burnTime
    );
}
