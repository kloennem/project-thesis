import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2 } from "./abi/abi";
import './App.css';


// Access our wallet inside of our dapp
// for Görli
const web3Goerli = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23"))
const providerGoerli = new ethers.providers.Web3Provider(web3Goerli.currentProvider);

// for BNB Testnet
const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");


// Contract addresses of the deployed smart contract
// for Görli
const protocol2AddressGoerli = "0x4ADA1d5f84f374E2496e0AA537373D5f3853bE78"

// for BNB Testnet
const protocol2AddressBNBTestnet = "0x8ebD4A32960D9e255b083A18030B4B3C58D01263"

const transferContractDestGoerli = new ethers.Contract(protocol2AddressGoerli, Protocol2, providerGoerli)
const transferContractDestBNBTestnet = new ethers.Contract(protocol2AddressBNBTestnet, Protocol2, providerBNBTestnet)

let protocol2AddressDest;
let transferContractSrc;
let transferContractDest;

function App() {
    // Hold variables that will interact with our contract and frontend
    const [recipientAddress, setRecipientAddress] = useState(0);      // recipient address
    const [sender, setSender] = useState(0)                           // source address
    const [tokenAmount, setAmount] = useState(0)
    const [currentNetwork, setCurrentNetwork] = useState("")
    const [status, setStatus] = useState("")
    const [balanceSenderField, setBalanceSenderField] = useState("-")
    const [balanceReceiverField, setBalanceReceiverField] = useState("-")

    useEffect(() => {
        setNetwork();
        callSetDestChain();
    });


    // setInterval(async function(){
    //     fetch("http://localhost:8000/ping")
    // }, 55000)

    const startTransaction = async (t) => {
        t.preventDefault();
        // await init();
        await getBalance();
        // await signBurn();
    };

    const getBalance = async (t) => {
        try {
            let balanceSender = await transferContractSrc.balanceOf(sender)
            let balanceReceiver = await transferContractDest.balanceOf(recipientAddress)
            balanceSender = JSON.stringify(parseInt(balanceSender), null, 4)
            balanceReceiver = JSON.stringify(parseInt(balanceReceiver), null, 4)
            setBalanceSenderField(balanceSender)
            setBalanceReceiverField(balanceReceiver)
        } catch {}
    };

    const signBurn = async (t) => {
        try {
            let prov = new ethers.providers.Web3Provider(window.ethereum);
            const Req = {
                from: sender,
                srcChain: (await prov.getNetwork()).chainId,
                recAddress: recipientAddress,
                targetContract: protocol2AddressDest,
                amount: tokenAmount,
            }

            let message = ethers.utils.solidityKeccak256(
                ['address', 'uint', 'address', 'address', 'uint'],
                [Req.from, Req.srcChain, Req.recAddress, Req.targetContract, Req.amount]
            );

            let signer = prov.getSigner();
            const arrayifyMessage = await ethers.utils.arrayify(message)
            const flatSignature = await signer.signMessage(arrayifyMessage)

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
            setStatus("transaction started")
        } catch {}
    }

    transferContractDestGoerli.on("Claim", async () => {
        try {
            getBalance();
            setStatus("transaction completed")
        } catch {}
    })
    transferContractDestBNBTestnet.on("Claim", async () => {
        try {
            getBalance();
            setStatus("transaction completed")
        } catch {}
    })

    const init = async () => {
        try {
            fetch("http://localhost:8000/init")
        } catch {}
    }

    window.ethereum.on('networkChanged', function () {
        setNetwork();
    });

    const setNetwork = async (t) => {
        try {
            let prov = new ethers.providers.Web3Provider(window.ethereum);
            let currentChain = ((await prov.getNetwork()).chainId)
            if (currentChain === 5) {
                transferContractSrc = new ethers.Contract(protocol2AddressGoerli, Protocol2, prov);
                setCurrentNetwork("Görli");
            }
            else if (currentChain === 97) {
                transferContractSrc = new ethers.Contract(protocol2AddressBNBTestnet, Protocol2, prov);
                setCurrentNetwork("BNB Testnet");
            }
            const account = (await prov.send('eth_requestAccounts'))[0];
            setSender(account)
        } catch {}
    }

    window.ethereum.on('accountsChanged', function () {
        callSetAcc();
    });

    const callSetAcc = async (t) => {
        try {
            let prov = new ethers.providers.Web3Provider(window.ethereum);
            const account = (await prov.send('eth_requestAccounts'))[0];
            setSender(account)
        } catch {}
    };

    const callSetDestChain = async (t) => {
        try {
            if (document.getElementById("chains").value === "goerli") {
                protocol2AddressDest = protocol2AddressGoerli;
                transferContractDest = transferContractDestGoerli;
            }
            else if (document.getElementById("chains").value === "bnb_testnet") {
                protocol2AddressDest = protocol2AddressBNBTestnet;
                transferContractDest = transferContractDestBNBTestnet;
            }
        } catch {}
    }

    const callSetRecipientAddress = async (t) => {
        document.getElementById("destAddr").value = sender
        setRecipientAddress(sender)
    };


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
                    <button className="button" type="submit" onClick={callSetAcc}>
                        Reload source address
                    </button>
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
                <div className="row" style={{ "width": "76vw" }}>
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
                                onChange={(t) => callSetRecipientAddress}
                            />
                        </form>
                        <button className="button" type="submit" onClick={callSetRecipientAddress} style={{ "float": "right" }}>Same as source address</button>
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
                <div className="row" style={{ "width": "70vw" }}>
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
                    </div>
                </div>
            </div>
        </div >
    );
}

export default App;