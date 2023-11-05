// const todo: add contract name = artifacts.require("todo: add contract file name");

const MetaForwarder = artifacts.require("MetaForwarder");
const TokenContract = artifacts.require("Protocol2");
const TxInclusionVerifier = artifacts.require("MockedTxInclusionVerifier");

module.exports = async function(deployer, network) {
//  deployer.deploy(todo: add contract name);
    await deployer.deploy(MetaForwarder);
    await deployer.deploy(TxInclusionVerifier, 0, 0, true);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, MetaForwarder.address);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, MetaForwarder.address);
};