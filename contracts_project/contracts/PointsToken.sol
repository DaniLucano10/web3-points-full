// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PointsToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("My Points", "PTS") Ownable(initialOwner) {}

    function mintPoints(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Bloquear transferencias
    function transfer(address, uint256) public pure override returns (bool) {
        revert("Puntos no son transferibles");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("Puntos no son transferibles");
    }

    // puntos enteros
    function decimals() public pure override returns (uint8) {
        return 0;
    }
}
