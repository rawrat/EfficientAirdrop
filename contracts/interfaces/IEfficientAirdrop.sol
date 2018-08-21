pragma solidity 0.4.19;

import "contracts/zeppelin/ownership/Ownable.sol";

contract IEfficientAirdrop is Ownable {

    event AirdropTransfer(address addr, uint256 num);

    function setRoot(bytes32 _merkleRoot) public;

    function getTokensByMerkleProof(bytes32[] _proof, address _who, uint256 _amount) public returns (bool);

    function getMerkleRoot() public view returns (bytes32);

}