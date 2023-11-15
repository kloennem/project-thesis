// const todo: add contract name = artifacts.require("todo: add contract file name");

const TokenContract = artifacts.require("Protocol2");
const TxInclusionVerifier = artifacts.require("OracleTxInclusionVerifier");
const oracleAddresses = ['0x8d8f171C4E067316eFF3d31c013973b8F4d0a742', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']

module.exports = async function(deployer, network) {
    await deployer.deploy(TxInclusionVerifier, oracleAddresses);
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, '0x8d8f171C4E067316eFF3d31c013973b8F4d0a742');
    await deployer.deploy(TokenContract, [], TxInclusionVerifier.address, 100, '0x8d8f171C4E067316eFF3d31c013973b8F4d0a742');
    // await deployer.deploy(TokenContract, [], '0x6fa64A3fBeD62945F17301f1330a769262f236e5', 100, '0x8d8f171C4E067316eFF3d31c013973b8F4d0a742');
    // await deployer.deploy(TokenContract, [], '0x6fa64A3fBeD62945F17301f1330a769262f236e5', 100, '0x8d8f171C4E067316eFF3d31c013973b8F4d0a742');
}