pragma solidity 0.4.19;


/**
 * @title MerkleUtils
 * @dev Operations with merkle trees
 */
library MerkleUtils {

    function leaf_from_address_and_num_tokens(address who, uint256 _n) public pure returns (bytes32) {
        
        string memory prefix = "0x";
        string memory s = " ";
        
        bytes memory pref = bytes(prefix);
        bytes memory toAscii = bytes(addressToAsciiString(who));
        bytes memory space = bytes(s);
        bytes memory strTokens = bytes(uintToStr(_n));

        string memory fullLeaf = new string(pref.length + toAscii.length + space.length + strTokens.length);
        bytes memory checkedLeaf = bytes(fullLeaf);

        uint k = 0;

        for (uint i = 0; i < pref.length; i++) 
            {checkedLeaf[k++] = pref[i];}

        for (i = 0; i < toAscii.length; i++) 
            {checkedLeaf[k++] = toAscii[i];}

        for (i = 0; i < space.length; i++) 
            {checkedLeaf[k++] = space[i];}

        for (i = 0; i < strTokens.length; i++) 
            {checkedLeaf[k++] = strTokens[i];}

        return bytes32(keccak256(fullLeaf));

    }

    function checkProof(bytes32[] proof, bytes32 _hash, bytes32 merkleRoot) public view returns (bool) {

        bytes32 el;
        bytes32 h = _hash;

        for (uint i = 0; i <= proof.length - 1; i += 1) {
            el = proof[i];

            if (h < el) {
                h = keccak256(h, el);
            } else {
                h = keccak256(el, h);
            }
        }

        return h == merkleRoot;

    }

    function addressToAsciiString(address x) public pure returns (string) {

        bytes memory s = new bytes(40);

        for (uint i = 0; i < 20; i++) {

            byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);

        }

        return string(s);

    }

     function uintToStr(uint someInt) public pure returns (string){

        if (someInt == 0) return "0";

        uint auxInt = someInt;

        uint length;

        while (auxInt != 0){

            length++;
            auxInt /= 10;

        }

        bytes memory preparedInt = new bytes(length);
        uint k = length - 1;

        while (someInt != 0){

            preparedInt[k--] = byte(48 + someInt % 10);
            someInt /= 10;

        }

        return string(preparedInt);

    }

    function char(byte b) public pure returns (byte c) {

        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);

    }


}