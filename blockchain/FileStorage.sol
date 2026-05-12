// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FileStorage {
    struct File {
        string filename;
        string cid;
        address owner;
        uint256 timestamp;
    }

    File[] public files;

    function addFile(string memory _filename, string memory _cid) public {
        files.push(File(_filename, _cid, msg.sender, block.timestamp));
    }

    function getFile(uint256 _index) public view returns (
        string memory,
        string memory,
        address,
        uint256
    ) {
        File memory f = files[_index];
        return (f.filename, f.cid, f.owner, f.timestamp);
    }

    function getFileCount() public view returns (uint256) {
        return files.length;
    }
}