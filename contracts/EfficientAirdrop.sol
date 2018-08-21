pragma solidity 0.4.19;

import "contracts/zeppelin/ERC20/MintableToken.sol";
import "contracts/interfaces/IEfficientAirdrop.sol";
import "contracts/utils/MerkleUtils.sol";

contract EfficientAirdrop is IEfficientAirdrop {

    address owner;
    bytes32 public merkleRoot;

    MintableToken tokenContract;

    mapping (address => bool) spent;

    function EfficientAirdrop(address _tokenContract, bytes32 _merkleRoot) public {

        owner = msg.sender;
        tokenContract = MintableToken(_tokenContract);
        merkleRoot = _merkleRoot;

    }

    function setRoot(bytes32 _merkleRoot) public onlyOwner {

        merkleRoot = _merkleRoot;

    }

    function leaf_from_address_and_num_tokens(address _a, uint256 _n) internal pure returns (bytes32) {
        
        return MerkleUtils.leaf_from_address_and_num_tokens(_a, _n);

    }


    function getTokensByMerkleProof(bytes32[] _proof, address _who, uint256 _amount) public returns (bool) {
        
        require(spent[_who] != true);
        require(_amount > 0);

        bytes32 leaf = leaf_from_address_and_num_tokens(_who, _amount);

        if ( !MerkleUtils.checkProof(_proof, leaf, merkleRoot) ) {
            return false;
        }

        spent[_who] = true;

        if (tokenContract.transfer(_who, _amount) == true) {

            AirdropTransfer(_who, _amount);
            return true;

        }
	
        require(false);

    }

    function getMerkleRoot() public view returns (bytes32) {

        return merkleRoot;

    }

}
