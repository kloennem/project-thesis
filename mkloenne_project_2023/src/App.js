import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2 } from "./abi/abi";
import './App.css';


// Access our wallet inside of our dapp
// for Görli
const web3Goerli = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23"))
const provider = new ethers.providers.Web3Provider(web3Goerli.currentProvider);
const signer = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", provider)

// for BNB Testnet
const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
const providerBNBTestnet = new ethers.providers.WebSocketProvider("wss://go.getblock.io/8e10fd3fdea94028b9601386ef306bda");
const signerBNBTestnet = new ethers.Wallet("2fadd9cc155f1563ff21d0be10036d4f15a325a77e8e1ccde22e62e4bb5dea78", providerBNBTestnet)


// Contract addresses of the deployed smart contract
// for Görli
const protocol2AddressSrcGoerli = "0xe996bd5E663a711CB4eFB0a30AF4D18A7DE45143"
const protocol2AddressDestGoerli = "0xF715401a3240C75e219c05d9940Dea7bdb61Fb38"

// for BNB Testnet
const protocol2AddressSrcBNBTestnet = "0xd21A7E1576AC660040b04B1699ed8c611c2Be72E"
const protocol2AddressDestBNBTestnet = "0x620B4A8D7D13FA00fEc27607B59C217c6355A4bD"

const transferContractDestGoerli = new ethers.Contract(protocol2AddressDestGoerli, Protocol2, signer)
const transferContractDestBNBTestnet = new ethers.Contract(protocol2AddressDestBNBTestnet, Protocol2, signerBNBTestnet)

let protocol2AddressSrc = protocol2AddressSrcGoerli;
let protocol2AddressDest = protocol2AddressDestGoerli;
let transferContractSrc;
let transferContractDest = transferContractDestGoerli;
let web3;

let prov = new ethers.providers.Web3Provider(window.ethereum);
prov.send('eth_requestAccounts', []);
transferContractSrc = new ethers.Contract(protocol2AddressSrc, Protocol2, prov.getSigner());

function App() {
    // Hold variables that will interact with our contract and frontend
    const [recipientAddress, setRecipientAddress] = useState(0);      // recipient address
    const [acc, setAcc] = useState(0)                                 // source address
    const [tokenAmount, setAmount] = useState(0)
    const [currentNetwork, setCurrentNetwork] = useState("")
    const [status, setStatus] = useState("")

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
        await signBurn();
        // let burnReceipt = await web3.eth.getTransactionReceipt(burned.hash)
        // document.getElementById("helper1").value = burned.hash
    };

    const getBalance = async (t) => {
        // t.preventDefault();    
        try {
            const balance110 = await transferContractSrc.balanceOf(acc)
            const balance220 = await transferContractDest.balanceOf(recipientAddress)
            document.getElementById("helper").value = balance110
            document.getElementById("helper1").value = balance220
        } catch { }
    };

    const signBurn = async (t) => {
        try {
            const function_hex = web3.eth.abi.encodeFunctionSignature('burn(address,address,uint,uint)')
            const Req = {
                from: acc,
                to: protocol2AddressSrc,
                value: 0,
                gas: 100000,
                srcChain: (await prov.getNetwork()).chainId,
                fun: function_hex,
                recAddress: recipientAddress,
                targetContract: protocol2AddressDest,
                amount: tokenAmount,
                stake: 0
            }

            let message = ethers.utils.solidityKeccak256(
                ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes', 'address', 'address', 'uint', 'uint'],
                [Req.from, Req.to, Req.value, Req.gas, Req.srcChain, Req.fun, Req.recAddress, Req.targetContract, Req.amount, Req.stake]
            );

            prov = new ethers.providers.Web3Provider(window.ethereum);
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
        } catch { }
    }

    transferContractDestGoerli.on("Claim", async () => {
        try {
            getBalance();
            setStatus("transaction completed")
        } catch { }
    })
    transferContractDestBNBTestnet.on("Claim", async () => {
        try {
            getBalance();
            setStatus("transaction completed")
        } catch { }
    })

    const init = async () => {
        try {
            const tC1 = await transferContractSrc.registerTokenContract(protocol2AddressDestGoerli);
            await tC1.wait();
            const tC1_2 = await transferContractSrc.registerTokenContract(protocol2AddressDestBNBTestnet);
            await tC1_2.wait();
            const tC2 = await transferContractDest.registerTokenContract(protocol2AddressSrcGoerli);
            await tC2.wait();
            const tC2_2 = await transferContractDest.registerTokenContract(protocol2AddressSrcBNBTestnet);
            await tC2_2.wait();
        } catch { }
    }

    window.ethereum.on('networkChanged', function (networkId) {
        setNetwork();
    });

    const setNetwork = async (t) => {
        try {
            prov = new ethers.providers.Web3Provider(window.ethereum);
            let temp = ((await prov.getNetwork()).chainId)
            if (temp === 5) {
                protocol2AddressSrc = protocol2AddressSrcGoerli;
                if (document.getElementById("chains").value === "goerli") {
                    protocol2AddressDest = protocol2AddressDestGoerli;
                }
                else if (document.getElementById("chains").value === "bnb_testnet") {
                    protocol2AddressDest = protocol2AddressDestBNBTestnet;
                }
                web3 = web3Goerli;
                setCurrentNetwork("Görli");
            }
            else if (temp === 97) {
                protocol2AddressSrc = protocol2AddressSrcBNBTestnet;
                if (document.getElementById("chains").value === "goerli") {
                    protocol2AddressDest = protocol2AddressDestGoerli;
                }
                else if (document.getElementById("chains").value === "bnb_testnet") {
                    protocol2AddressDest = protocol2AddressDestBNBTestnet;
                }
                web3 = web3BNBTestnet;
                setCurrentNetwork("BNB Testnet");
            }
            const account = (await prov.send('eth_requestAccounts'))[0];
            setAcc(account)
            transferContractSrc = new ethers.Contract(protocol2AddressSrc, Protocol2, prov.getSigner());
        } catch { }
    }

    window.ethereum.on('accountsChanged', function (accounts) {
        callSetAcc();
    });

    const callSetAcc = async (t) => {
        try {
            // t.preventDefault();
            prov = new ethers.providers.Web3Provider(window.ethereum);
            const account = (await prov.send('eth_requestAccounts'))[0];
            setAcc(account)
        } catch { }
    };

    const callSetDestChain = async (t) => {
        try {
            if (document.getElementById("chains").value === "goerli") {
                protocol2AddressDest = protocol2AddressDestGoerli;
                transferContractDest = transferContractDestGoerli;
            }
            else if (document.getElementById("chains").value === "bnb_testnet") {
                protocol2AddressDest = protocol2AddressDestBNBTestnet;
                transferContractDest = transferContractDestBNBTestnet;
            }
            else {
            }
        } catch { }
    }

    const callSetRecipientAddress = async (t) => {
        document.getElementById("destAddr").value = acc
        setRecipientAddress(acc)
    };


    return (
        <div className="main">

            {/* source address */}
            <div className="row" style={{ "width": "40vw" }}>
                <form className="form">
                    <label>
                        Source address:
                        <br />
                        {acc}
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
                            </label>
                            <input /* todo: make all inputs labels*/
                                className="input"
                                type="text"
                                name="helper"
                                id="helper"
                            />
                        </form>
                        <form className="form" style={{ "float": "left" }}>
                            <label>
                                amount of tokens of destination address on destination chain:
                            </label>
                            <input
                                className="input"
                                type="text"
                                name="helper1"
                                id="helper1"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default App;