import Web3 from 'web3';
import assertBnEq from './helpers/assertBigNumbersEqual';
import MerkleTree from './helpers/merkleTree';

const fs = require('fs');
const EfficientAirdrop = artifacts.require("./EfficientAirdrop.sol");
const MintableToken = artifacts.require("./zeppelin/ERC20/MintableToken.sol");

const web3 = new Web3()

 contract('EfficientAirdrop', function(accs) {

	let TOTAL_TOKENS = 10 * 10000;

	let mintableToken;
	let merkleAirdrop;
	let leafsArray = [];
	let merkleTree;
	let merkleRootHex;

	beforeEach(async () => {

		leafsArray.length = 0;

		leafsArray = generateLeafs(4);
		
		leafsArray.push(accs[4] + ' 100');
		leafsArray.push(accs[5] + ' 88');
		leafsArray.push(accs[6] + ' 99');
		leafsArray.push(accs[7] + ' 66');

        merkleTree = new MerkleTree(leafsArray);
        merkleRootHex = merkleTree.getHexRoot();

		mintableToken = await MintableToken.new({from: accs[0]});

		merkleAirdrop = await EfficientAirdrop.new(mintableToken.address, merkleRootHex, {from: accs[0]});

		await mintableToken.mint(merkleAirdrop.address, TOTAL_TOKENS * 10**18);

    });

  	it("Write merkle data to a file", async function() {
   
        let data = leafsArray.join("\n");
		fs.writeFileSync("merkleData.txt", data);
		
	});

 	it("tests for success mint for allowed set of users", async function() {
	
		for(let i = 0; i < leafsArray.length - 1; i++) {

			let leaf = leafsArray[i];

			let merkle_proof = await merkleTree.getHexProof(leaf);
			
			let userAddress = leaf.split(" ")[0];
			let numTokens = leaf.split(" ")[1];

			let airdropContractBalance = await mintableToken.balanceOf(merkleAirdrop.address);

			let userTokenBalance = await mintableToken.balanceOf(userAddress);

			assert.isOk(await merkleAirdrop.getTokensByMerkleProof(merkle_proof, userAddress, numTokens), 'getTokensByMerkleProof() did not return true for a valid proof');

			assertBnEq(await mintableToken.balanceOf(merkleAirdrop.address), airdropContractBalance.minus(numTokens), "balance of airdrop contract was not decreased by numTokens");
			assertBnEq(await mintableToken.balanceOf(userAddress), userTokenBalance.plus(numTokens), "balance of user was not increased by numTokens");
		
		}
	});

 	it("tests for success mint for newly added user", async function() {
		
		leafsArray.push(accs[8] + ' 78');
	
		merkleTree = new MerkleTree(leafsArray);
		merkleRootHex = merkleTree.getHexRoot();
		
		await merkleAirdrop.setRoot(merkleRootHex);
	
		let leaf = accs[8] + ' 78';
		let merkle_proof = await merkleTree.getHexProof(leaf);
		
		let userAddress = leaf.split(" ")[0];
		let numTokens = leaf.split(" ")[1];

		let airdropContractBalance = await mintableToken.balanceOf(merkleAirdrop.address);
		let userTokenBalance = await mintableToken.balanceOf(userAddress);

		assert.isOk(await merkleAirdrop.getTokensByMerkleProof(merkle_proof, userAddress, numTokens), 'getTokensByMerkleProof() did not return true for a valid proof');
		assertBnEq(await mintableToken.balanceOf(merkleAirdrop.address), airdropContractBalance.minus(numTokens), "balance of airdrop contract was not decreased by numTokens");
		assertBnEq(await mintableToken.balanceOf(userAddress), userTokenBalance.plus(numTokens), "balance of user was not increased by numTokens");
	
	});

	//Generate random leafs

	function generateLeafs(n) {

		let leafs = [];

		for(let i = 0; i < n; i++) {

			let acc = web3.eth.accounts.create("" + i);
			leafs.push('' + acc.address.toLowerCase() + ' ' + Math.floor((Math.random() * 100) + 1));

		}

		return leafs;

	}

})
