// const todo: add contract name = artifacts.require("todo: add contract file name");

// module.exports = function(deployer) {
//  deployer.deploy(todo: add contract name);
// };

const TokenContract = artifacts.require("Protocol2");
const TxInclusionVerifier = artifacts.require("MockedTxInclusionVerifier");

module.exports = async function(deployer, network) {

    await deployer.deploy(TxInclusionVerifier, 0, 0, true);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100);
}