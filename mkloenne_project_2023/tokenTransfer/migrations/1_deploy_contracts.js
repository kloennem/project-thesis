// const todo: add contract name = artifacts.require("todo: add contract file name");

const TransferContract = artifacts.require("TransferContract");
const TxInclusionVerifier = artifacts.require("OracleTxInclusionVerifier");
const oracleAddresses = ['0x8d8f171C4E067316eFF3d31c013973b8F4d0a742', '0xce63A6f8e58dfD56875B7e58044A1817f0c781FA', '0xfF0cd710D99ab885F21Aa55629b4efb8F7C3939b', '0xE6CcdD30f1F69dCF63768805CDd3A4Dd93a85853', '0xFd48F1D2df2e3511A6af3cEFE1831558CCcA90E7', '0x1753Ad6f955f0F090dcD84eEc92D86bf608EDa01', '0xc5ce7f57C23f8810359E46A40909bba84EdD8F71', '0xdd790990cE3bE22dA4450D3178e50dAf0B19D79A', '0xB0F4E813bF8D95927fb36bd6aE2538e38fd63a64', '0xa12603C7917b4a02B7d74e92EBb22dcdc2DfBa86']

module.exports = async function (deployer) {
    await deployer.deploy(TxInclusionVerifier, oracleAddresses);
    await deployer.deploy(TransferContract, [], TxInclusionVerifier.address, 100000, '0x8d8f171C4E067316eFF3d31c013973b8F4d0a742');
}