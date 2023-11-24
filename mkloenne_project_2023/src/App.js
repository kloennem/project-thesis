import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { TransferContract } from "./abi/abi";
import './App.css';


// Access our wallet inside of our dapp
// for Görli
const web3Goerli = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23"));
const providerGoerli = new ethers.providers.Web3Provider(web3Goerli.currentProvider);

// for BNB Testnet
const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");


// Contract addresses of the deployed smart contract
// for Görli
const transferAddressGoerli = "0x545DB59ADE84e2596D9CDF21B62B4d5A0C500a5a";

// for BNB Testnet
const transferAddressBNBTestnet = "0xedc7f92E5E011Bb6bF451E1999355106DE7FDD02";

const transferContractDestGoerli = new ethers.Contract(transferAddressGoerli, TransferContract, providerGoerli);
const transferContractDestBNBTestnet = new ethers.Contract(transferAddressBNBTestnet, TransferContract, providerBNBTestnet);

let transferAddressDest;
let transferContractSrc;
let transferContractDest;

function App() {
    // Hold variables that will interact with our contract and frontend
    const [sender, setSender] = useState(0);
    const [currentNetwork, setCurrentNetwork] = useState("");
    const [recipientAddress, setRecipientAddress] = useState(0);
    const [tokenAmount, setAmount] = useState(0);
    const [status, setStatus] = useState("");
    const [balanceSenderField, setBalanceSenderField] = useState("-");
    const [balanceReceiverField, setBalanceReceiverField] = useState("-");

    useEffect(() => {
        setNetwork();
        callSetDestChain();
    });

    const startTransaction = async (t) => {
        t.preventDefault();
        // await init();
        await getBalance();
        await signBurn();
    };

    const getBalance = async (t) => {
        try {
            let balanceSender = await transferContractSrc.balanceOf(sender);
            let balanceReceiver = await transferContractDest.balanceOf(recipientAddress);
            balanceSender = JSON.stringify(parseInt(balanceSender), null, 4);
            balanceReceiver = JSON.stringify(parseInt(balanceReceiver), null, 4);
            setBalanceSenderField(balanceSender);
            setBalanceReceiverField(balanceReceiver);
        } catch { }
    };

    const signBurn = async (t) => {
        try {
            if (Number(balanceSenderField) < tokenAmount) {
                setStatus("not enough tokens");
            }
            else {
                let provider = new ethers.providers.Web3Provider(window.ethereum);
                const Req = {
                    from: sender,
                    srcChain: (await provider.getNetwork()).chainId,
                    recAddress: recipientAddress,
                    targetContract: transferAddressDest,
                    amount: tokenAmount,
                };

                let message = ethers.utils.solidityKeccak256(
                    ['address', 'uint', 'address', 'address', 'uint'],
                    [Req.from, Req.srcChain, Req.recAddress, Req.targetContract, Req.amount]
                );

                let signer = provider.getSigner();
                const arrayifyMessage = await ethers.utils.arrayify(message);
                const flatSignature = await signer.signMessage(arrayifyMessage);

                fetch("http://localhost:8000/postBurn", {
                    method: "POST",
                    body: JSON.stringify({
                        reqStruct: Req,
                        signature: flatSignature
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                    .then((res) => res.json())
                setStatus("transaction started");
            }
        } catch { }
    }

    transferContractDestGoerli.on("Claim", async () => {
        try {
            setStatus("transaction completed");
            getBalance();
        } catch { }
    })
    transferContractDestBNBTestnet.on("Claim", async () => {
        try {
            setStatus("transaction completed");
            getBalance();
        } catch { }
    })

    const init = async () => {
        try {
            fetch("http://localhost:8000/init");
        } catch { }
    }

    window.ethereum.on('networkChanged', function () {
        setNetwork();
    });

    const setNetwork = async (t) => {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let currentChain = ((await provider.getNetwork()).chainId);
            if (currentChain === 5) {
                transferContractSrc = new ethers.Contract(transferAddressGoerli, TransferContract, provider);
                setCurrentNetwork("Görli");
            }
            else if (currentChain === 97) {
                transferContractSrc = new ethers.Contract(transferAddressBNBTestnet, TransferContract, provider);
                setCurrentNetwork("BNB Testnet");
            }
            const account = (await provider.send('eth_requestAccounts'))[0];
            setSender(account);
        } catch { }
    }

    window.ethereum.on('accountsChanged', function () {
        callSetAcc();
    });

    const callSetAcc = async (t) => {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            const account = (await provider.send('eth_requestAccounts'))[0];
            setSender(account);
        } catch { }
    };

    const callSetDestChain = async (t) => {
        try {
            if (document.getElementById("chains").value === "goerli") {
                transferAddressDest = transferAddressGoerli;
                transferContractDest = transferContractDestGoerli;
            }
            else if (document.getElementById("chains").value === "bnb_testnet") {
                transferAddressDest = transferAddressBNBTestnet;
                transferContractDest = transferContractDestBNBTestnet;
            }
        } catch { }
    }

    const setSenderAsRecipient = async (t) => {
        document.getElementById("destAddr").value = sender;
        setRecipientAddress(sender);
    };

    const callSetRecipientAddress = async (t) => {
        setStatus("setRec");
        let address = document.getElementById("destAddr").value;
        address = ethers.utils.getAddress(address);
        setRecipientAddress(address);
    }


    return (
        <div className="main">

            {/* source address */}
            <div className="row" style={{ "width": "40vw" }}>
                <form className="form">
                    <label>
                        Source address:
                        <br />
                        {sender}
                    </label>
                </form>
            </div>

            <div className="card">

                {/* blockchains */}
                <div className="row" style={{ "width": "80vw" }}>
                    <div class="box">
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                Source Blockchain:
                                <br />
                                {currentNetwork}
                            </label>
                        </form>
                        <form className="form" style={{ "float": "right" }}>
                            <label>
                                Choose destination Blockchain:
                            </label>
                            <select name="chains" id="chains" style={{ "width": "300px" }} onChange={callSetDestChain}>
                                <option selected="selected" value="goerli">Görli</option>
                                <option value="bnb_testnet">BNB Testnet</option>
                            </select>
                        </form>
                    </div>
                </div>

                {/* destination address */}
                <div className="row" style={{ "width": "71vw" }}>
                    <div class="box">
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                Set destination address:
                            </label>
                            <input
                                className="input"
                                type="text"
                                style={{ "width": "250px" }}
                                name="name"
                                id="destAddr"
                            />
                        </form>
                        <button className="button" type="submit" onClick={setSenderAsRecipient} style={{ "float": "right" }}>
                            Same as source address
                        </button>
                        <br />
                        <button className="button" type="submit" onClick={callSetRecipientAddress} style={{ "float": "right" }}>
                            Submit destination address
                        </button>
                    </div>
                </div>

                {/* token type and amount */}
                <div className="row" style={{ "width": "80vw" }}>
                    <div class="box">
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                Set token type:
                            </label>
                            <select name="token_type" style={{ "width": "300px" }}>
                                <option selected="selected" value="example token">Example Token</option>
                            </select>
                        </form>
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                Set token amount to be sent:
                            </label>
                            <input
                                className="input"
                                type="number"
                                name="amount"
                                id="amount"
                                onChange={(t) => setAmount(t.target.value)}
                            />
                        </form>
                    </div>
                </div>

                {/* start transaction button */}
                <div className="row" style={{ "width": "67vw" }}>
                    <form className="form" style={{ "float": "left" }}>
                        <button className="button" onClick={startTransaction} style={{ "width": "300px" }} type="button">
                            Start Transaction
                        </button>
                    </form>
                    <form className="form" style={{ "float": "left" }}>
                        <label>
                            transfer status:
                            <br />
                            {status}
                        </label>
                    </form>
                </div>

                {/*current balances*/}
                <div className="row" style={{ "width": "80vw" }}>
                    <div class="box">
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                amount of tokens of source address on source chain:
                                <br />
                                {balanceSenderField}
                            </label>
                        </form>
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                amount of tokens of destination address on destination chain:
                                <br />
                                {balanceReceiverField}
                            </label>
                        </form>
                        <br />
                        <form className="form" style={{ "float": "left" }}>
                            <button className="button" onClick={getBalance} style={{ "width": "300px" }} type="button">
                                Get Balance
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default App;