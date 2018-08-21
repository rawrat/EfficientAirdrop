var EfficientAirdrop = artifacts.require("./EfficientAirdrop.sol");
var MintableToken = artifacts.require("contracts/zeppelin/ERC20/MintableToken.sol");
var MerkleUtils = artifacts.require("contracts/utils/MerkleUtils.sol");

module.exports = async function(deployer, network, accounts) {

    var tokenAmount = 10 * 1000 * 1000 * 10**18;

    if (network == "development") {

        await deployer.deploy(MerkleUtils);

        await deployer.link(MerkleUtils, EfficientAirdrop);

        await deployer.deploy(MintableToken);

        await deployer.deploy(EfficientAirdrop, MintableToken.address, "someRoot", {from: accounts[0]});

        await MintableToken.at(MintableToken.address)
            .mint(EfficientAirdrop.address, tokenAmount);

    } else if (network == "rinkeby" || network == "ropsten") {



    }
  
}
