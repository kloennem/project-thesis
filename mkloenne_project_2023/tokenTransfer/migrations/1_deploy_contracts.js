// const todo: add contract name = artifacts.require("todo: add contract file name");
const TokenContract = artifacts.require("Protocol2");
const TxInclusionVerifier = artifacts.require("MockedTxInclusionVerifier");
const MyPaymaster = artifacts.require("MyPaymaster")

module.exports = async function(deployer) {
//  deployer.deploy(todo: add contract name);
    await deployer.deploy(TxInclusionVerifier, 0, 0, true);
    await deployer.deploy(MyPaymaster)
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, '0xB2b5841DBeF766d4b521221732F9B618fCf34A87');
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, '0xB2b5841DBeF766d4b521221732F9B618fCf34A87');
};