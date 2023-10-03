import React, { useState } from "react";
// import { SimpleStorage } from "./abi/abi"; // todo: change contract name
import Web3 from "web3";
import BigNumber from "bignumber.js"
import './App.css';

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);

// Contract address of the deployed smart contract
// const contractAddress = "0xCF2FaD8b797A60025ADCC5E635A734D89e4dC76b" // for Ganache
// const contractAddress = "0x81185b091315cF59FbF1c0A128b6D330b905B977"; // for Goerli

// const storageContract = new web3.eth.Contract(SimpleStorage, contractAddress); // todo: change variable names, contract name

function App() {
  // Hold variables that will interact with our contract and frontend
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("0");
  const [acc, setAcc] = useState(window.ethereum.enable()[0])
  
  const numberSet = async (t) => {
    document.getElementById("helper").value = number
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    setAcc(account)
    // Get permission to access user funds to pay for gas fees
    // const gas = await storageContract.methods.set(number).estimateGas();
    // const post = await storageContract.methods.set(number).send({
    //   from: account,
    //   gas,
    // });
  };

  const numberGet = async (t) => {
    t.preventDefault();
//     const post = await storageContract.methods.get().call();
//     const post2 = BigNumber(post, 10).toString(16)
    const post2 = number.toString(16)
    setGet(post2);
  };

  const callSetAcc = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    setAcc(account)
  };

  const setDestAddr = async (t) => {
    document.getElementById("destAddr").value = acc
    setUint(BigNumber(document.getElementById("destAddr").value, 16))
  };
  
  return (
    <div className="main">
      
      {/* source address */}
      <div className="row" style={{"width":"40vw"}}>
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
        <div className="row" style={{"width":"80vw"}}>
          <div class="box">
            <form className="form" style={{"float":"left"}}>
              <label>
                Choose source Blockchain:
              </label>
              <select name="chains" style={{"width":"300px"}}>
                <option selected="selected" value="goerli">Görli</option>
                <option value="sepolia">Sepolia</option>
              </select>
            </form>
            <form className="form" style={{"float":"right"}}>
              <label>
                Choose destination Blockchain:
              </label>
              <select name="chains" style={{"width":"300px"}}>
                <option selected="selected" value="goerli">Görli</option>
                <option value="sepolia">Sepolia</option>
              </select>
            </form>
          </div>
        </div>

        {/* destination address */}
        <div className="row" style={{"width":"76vw"}}>
          <div class="box">
            <form className="form" style={{"float":"left"}}>
              <label>
                Set destination address:
              </label>
              <input
                className="input"
                type="text"
                style={{"width":"250px"}}
                name="name"
                id="destAddr"
                onChange={(t) => setUint(BigNumber(t.target.value, 16))}
                />
            </form>
            <button className="button" type="submit" onClick={setDestAddr} style={{"float":"right"}}>Same as source address</button>
          </div>
        </div>

        {/* token type and amount */}
        <div className="row" style={{"width":"61vw"}}>
          <div class="box">
            <form className="form">
              <label>
                Set token amount to be sent:
              </label>
              <input
               className="input"
               type="text"
               name="name"
              />
            </form>
          </div>
        </div>
        
        {/* start transaction button */}
        <div className="row" style={{"width":"56vw"}}>
          <form className="form">
            <button className="button" onClick={numberGet} style={{"width":"500px"}} type="button">
              Start Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;