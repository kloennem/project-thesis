// const todo: add contract name = artifacts.require("todo: add contract file name");

const MetaForwarder = artifacts.require("MetaForwarder");
const TokenContract = artifacts.require("Protocol2");
const TxInclusionVerifier = artifacts.require("OracleTxInclusionVerifier");
const oracleAddresses = ['0x8d8f171C4E067316eFF3d31c013973b8F4d0a742', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']

module.exports = async function(deployer, network) {
    await deployer.deploy(MetaForwarder);
    await deployer.deploy(TxInclusionVerifier, oracleAddresses);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, MetaForwarder.address);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, MetaForwarder.address);
}