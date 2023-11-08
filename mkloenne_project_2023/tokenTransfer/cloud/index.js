const ethers = require('ethers')
const MetaForwarder = require('./abi/abi')
const Web3 = require('web3')

const express = require("express")

const app = express();
const port = 7000;

app.get('/', function(req, res){
    console.log(`Got Get`); 
    const web3 = new Web3(Web3.givenProvider);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    
    // const metaFAddress = "0x6b18654d0142D3A4918739c8f9342a4e8085B7Ca"      // for Görli
    // const metaFContract = new ethers.Contract(metaFAddress, MetaForwarder, signer);

});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});