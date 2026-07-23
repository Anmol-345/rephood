// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RepHoodAttestation
 * @dev Autonomous Agentic Reputation Engine on Robinhood Chain
 */
contract RepHoodAttestation {
    
    // Event emitted whenever a new attestation is logged
    event AttestationEmitted(
        address indexed caller,
        string agentId,
        uint256 trustScore,
        string ipfsHash,
        uint256 timestamp
    );

    /**
     * @notice Emits a reputation attestation for a specific agent.
     * @param agentId The Virtuals Protocol Agent ID (e.g., "VAGT-001")
     * @param trustScore The calculated reputation score (scaled by 100, e.g., 78.4 -> 7840)
     * @param ipfsHash The IPFS CID containing the evaluation record and reasoning matrix
     */
    function emitAttestation(string memory agentId, uint256 trustScore, string memory ipfsHash) external {
        // Emit the event to be indexed by off-chain services
        emit AttestationEmitted(msg.sender, agentId, trustScore, ipfsHash, block.timestamp);
    }
}
