import React, { useState } from "react";
// import { SimpleStorage } from "./abi/abi"; // todo: change contract name
import Web3 from "web3";
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
//     const post2 = parseInt(post, 10).toString(16)
//     setGet(post2);
    setGet(number)
  };

  const callSetAcc = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    setAcc(account)
  };

  const setDestAddr = async (t) => {
    document.getElementById("destAddr").value = acc
  };
  
  return (
     <div className="main">
       <div className="card">
         <div className="row">
         <form className="form">
           <label>
             Set ETH amount to be sent:
             <br />
             <input
               className="input"
               type="text"
               name="name"
               onChange={(t) => setUint(parseInt(t.target.value, 16))}
             />
           </label>
         </form>
         </div>
         <br />
         <div className="row">
           <div className="column">
           <hr />
             <form className="form">
                <label>
                    Choose source Blockchain:
                </label>
               <select name="chains">
                  <option selected="selected" value="goerli">Görli</option>
                  <option value="sepolia">Sepolia</option>
               </select>
             </form>
             <hr />
             <form className="form2">
               <label>
                 Source address:
                 <br />
                 {acc}
               </label>
               <button className="button" type="submit" onClick={callSetAcc}>
                 Reload source address
               </button>
             </form>
             <br />
             <input
                 className="input"
                 type="text"
                 name="helper"
                 id="helper"
               />
           </div>
           <div className="vl"></div>
           <div className="column">
           <hr />
             <form className="form">
                <label>
                    Choose destination Blockchain:
                </label>
               <select name="chains">
                  <option selected="selected" value="goerli">Görli</option>
                  <option value="sepolia">Sepolia</option>
               </select>
             </form>
             <hr />
             <button className="button2" type="submit" onClick={setDestAddr}>Destination address equal to source address</button>
             <form className="form2">
               <label>
                 Set destination address:
                 <br />
                 <input
                   className="input"
                   type="text"
                   name="name"
                   id="destAddr"
                   onChange={(t) => setUint(parseInt(t.target.value, 16))}
                 />
               </label>
               <button className="button" type="submit" value="Confirm" onClick={numberSet}>
                 Confirm
               </button>
             </form>
             <hr />
             <button className="button" onClick={numberGet} type="button">
               Get your hex
             </button>
             <br />
             {getNumber}
           </div>
         </div>
       </div>
     </div>
  );
}

export default App;