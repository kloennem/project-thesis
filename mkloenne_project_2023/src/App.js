import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Protocol2 } from "./abi/abi";
import './App.css';


// Access our wallet inside of our dapp
// for Görli
const web3Goerli = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/2e342128028646b9b9ea1ef796849e23"))

// for BNB Testnet
const web3BNBTestnet = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))


// Contract addresses of the deployed smart contract
// for Görli
const protocol2AddressSrcGoerli = "0x1c6dFBa8F90d3258328D223FCFa2FB42DC05Fb42"
const protocol2AddressDestGoerli = "0x21d367a7618bE5883916c3030094236B9Ce48405"

// for BNB Testnet
const protocol2Address1BNBTestnet = "0x6c657149Eaa9953dBFc44Aa02b8313178B847ce9"
const protocol2Address2BNBTestnet = "0x73278Fea53Aeb67F9Af194aF53c1159F419a7ccF"

let protocol2AddressSrc = protocol2AddressSrcGoerli;
let protocol2AddressDest = protocol2AddressDestGoerli;
let transferContractSrc;
let transferContractDest;
let web3;

let prov = new ethers.providers.Web3Provider(window.ethereum);
prov.send('eth_requestAccounts', []);
transferContractSrc = new ethers.Contract(protocol2AddressSrc, Protocol2, prov.getSigner());
transferContractDest = new ethers.Contract(protocol2AddressDest, Protocol2, prov.getSigner());

function App() {
    // Hold variables that will interact with our contract and frontend
    const [recipientAddress, setRecipientAddress] = useState(0);      // recipient address
    const [acc, setAcc] = useState(0)                                 // source address
    const [tokenAmount, setAmount] = useState(0)
    const [currentNetwork, setCurrentNetwork] = useState("")

    useEffect(() => {
        setNetwork();
    });

    window.ethereum.on('networkChanged', function (networkId) {
        document.getElementById("helper2").value = networkId
        setNetwork();
    });

    window.ethereum.on('accountsChanged', function (accounts) {
        callSetAcc();
    });

    const setNetwork = async (t) => {
        prov = new ethers.providers.Web3Provider(window.ethereum);
        let temp = ((await prov.getNetwork()).chainId)
        if (temp === 5) {
            protocol2AddressSrc = protocol2AddressSrcGoerli;
            protocol2AddressDest = protocol2AddressDestGoerli; // todo: change to BNB + init
            web3 = web3Goerli;
            setCurrentNetwork("Görli");
        }
        else if (temp === 97) {
            protocol2AddressSrc = protocol2Address1BNBTestnet;
            protocol2AddressDest = protocol2Address2BNBTestnet; // todo: change to Goerli + init
            web3 = web3BNBTestnet;
            setCurrentNetwork("BNB Testnet");
        }
        const account = (await prov.send('eth_requestAccounts'))[0];
        setAcc(account)
        transferContractSrc = new ethers.Contract(protocol2AddressSrc, Protocol2, prov.getSigner());
        transferContractDest = new ethers.Contract(protocol2AddressDest, Protocol2, prov.getSigner());
    }

    transferContractDest.on("Claim", async (burnContract, sender, burnTime) => {
        try {
            const balance110 = await transferContractSrc.balanceOf(acc)
            const balance210 = await transferContractDest.balanceOf(acc)
            const balance220 = await transferContractDest.balanceOf(recipientAddress)
            document.getElementById("helper").value = balance110
            document.getElementById("helper1").value = balance210
            document.getElementById("helper2").value = balance220
        } catch { }
    })

    const callSetAcc = async (t) => {
        // t.preventDefault();
        prov = new ethers.providers.Web3Provider(window.ethereum);
        const account = (await prov.send('eth_requestAccounts'))[0];
        setAcc(account)
    };

    const init = async () => {
        const tC1 = await transferContractSrc.registerTokenContract(protocol2AddressDest);
        await tC1.wait();
        const tC2 = await transferContractDest.registerTokenContract(protocol2AddressSrc);
        await tC2.wait();
    };

    const startTransaction = async (t) => {
        t.preventDefault();
        // await init();
        await getBalance();
        await signBurn();
        // let burnReceipt = await web3.eth.getTransactionReceipt(burned.hash)
        // document.getElementById("helper2").value = temp
        // document.getElementById("helper1").value = burned.hash
    };

    const getBalance = async (t) => {
        // t.preventDefault();    
        const balance110 = await transferContractSrc.balanceOf(acc)
        const balance210 = await transferContractDest.balanceOf(acc)
        const balance220 = await transferContractDest.balanceOf(recipientAddress)
        document.getElementById("helper").value = balance110
        document.getElementById("helper1").value = balance210
        document.getElementById("helper2").value = balance220
    };

    const setDestAddr = async (t) => {
        document.getElementById("destAddr").value = acc
        setRecipientAddress(acc)
    };

    const signBurn = async (t) => {
        const function_hex = web3.eth.abi.encodeFunctionSignature('burn(address,address,uint,uint)')
        const Req = {
            from: acc,
            to: protocol2AddressSrc,
            value: 0,
            gas: 100000,
            nonce: 0,
            fun: function_hex,
            recAddress: recipientAddress,
            targetContract: protocol2AddressDest,
            amount: tokenAmount,
            stake: 0
        }

        let message = ethers.utils.solidityKeccak256(
            ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes', 'address', 'address', 'uint', 'uint'],
            [Req.from, Req.to, Req.value, Req.gas, Req.nonce, Req.fun, Req.recAddress, Req.targetContract, Req.amount, Req.stake]
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
            .then((req) => document.getElementById("helper1").value = req.message)
    }

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
                            <select name="chains" style={{ "width": "300px" }}>
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
                                onChange={(t) => setDestAddr}
                            />
                        </form>
                        <button className="button" type="submit" onClick={setDestAddr} style={{ "float": "right" }}>Same as source address</button>
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
                <div className="row" style={{ "width": "56vw" }}>
                    <form className="form">
                        <button className="button" onClick={startTransaction} style={{ "width": "500px" }} type="button">
                            Start Transaction
                        </button>
                    </form>
                </div>
                <div className="row" style={{ "width": "70vw" }}>
                    <input
                        className="input"
                        type="text"
                        name="helper"
                        id="helper"
                    />
                    <br />
                    <input
                        className="input"
                        type="text"
                        name="helper1"
                        id="helper1"
                    />
                    <br />
                    <input
                        className="input"
                        type="text"
                        name="helper2"
                        id="helper2"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;