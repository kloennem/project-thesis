// const todo: add contract name = artifacts.require("todo: add contract file name");

const MetaForwarder = artifacts.require("MetaForwarder");
const TokenContract = artifacts.require("Protocol2");
const TxInclusionVerifier = artifacts.require("MockedTxInclusionVerifier");

module.exports = async function(deployer, network) {
//  deployer.deploy(todo: add contract name);
    // await deployer.deploy(MetaForwarder);
    // await deployer.deploy(TxInclusionVerifier, 0, 0, true);
    // await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, MetaForwarder.address);
    // await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, MetaForwarder.address);
    await deployer.deploy(TokenContract, [], '0x0e69Ea27C1cdCF208D320b8B5ca3E9C1EF46339E', 100, '0x6b18654d0142D3A4918739c8f9342a4e8085B7Ca');
};