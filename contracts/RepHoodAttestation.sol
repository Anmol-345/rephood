// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RepHoodAttestation
 * @dev Autonomous Agentic Reputation Engine on Botchain (ECDSA Verified)
 */
contract RepHoodAttestation {
    
    address public owner;
    address public trustedSigner;

    // Store agent trust scores (scaled by 100, e.g., 85.00 -> 8500)
    mapping(string => uint256) public agentScores;
    // Track nonces to prevent replay attacks
    mapping(string => uint256) public agentNonces;
    // Track public feedback to prevent spam (agentId => userAddress => hasRated)
    mapping(string => mapping(address => bool)) public hasRated;

    // Event emitted whenever a new attestation is computed and logged
    event AttestationEmitted(
        address indexed caller,
        string agentId,
        uint256 vtx,
        uint256 aAge,
        uint256 mFlag,
        uint256 newTrustScore,
        string ipfsHash,
        uint256 timestamp
    );

    // Event emitted when public feedback is logged
    event AgentRated(
        address indexed voter,
        string agentId,
        uint8 rating,
        uint256 newTrustScore
    );

    constructor(address _trustedSigner) {
        owner = msg.sender;
        trustedSigner = _trustedSigner;
    }

    function setTrustedSigner(address _trustedSigner) external {
        require(msg.sender == owner, "Only owner can set signer");
        trustedSigner = _trustedSigner;
    }

    /**
     * @notice Recovers the signer's address from a cryptographic signature
     */
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /**
     * @notice Computes an integer base-2 logarithm (floor).
     */
    function log2(uint256 x) internal pure returns (uint256 result) {
        if (x >= 2**128) { x >>= 128; result += 128; }
        if (x >= 2**64) { x >>= 64; result += 64; }
        if (x >= 2**32) { x >>= 32; result += 32; }
        if (x >= 2**16) { x >>= 16; result += 16; }
        if (x >= 2**8) { x >>= 8; result += 8; }
        if (x >= 2**4) { x >>= 4; result += 4; }
        if (x >= 2**2) { x >>= 2; result += 2; }
        if (x >= 2**1) { result += 1; }
    }

    /**
     * @notice Allows the public to rate an agent, slightly impacting the score.
     * @param agentId The Virtuals Protocol Agent ID
     * @param rating 1-5 star rating
     */
    function rateAgent(string memory agentId, uint8 rating) external {
        require(rating >= 1 && rating <= 5, "Rating must be 1-5");
        require(!hasRated[agentId][msg.sender], "Already rated this agent");
        
        hasRated[agentId][msg.sender] = true;

        uint256 currentScore = agentScores[agentId];
        if (currentScore == 0) {
            currentScore = 8500;
        }

        int256 delta = 0;
        if (rating == 5) delta = 100;       // +1.00
        else if (rating == 4) delta = 50;   // +0.50
        else if (rating == 3) delta = 0;    // +0.00
        else if (rating == 2) delta = -50;  // -0.50
        else if (rating == 1) delta = -100; // -1.00

        int256 newScoreInt = int256(currentScore) + delta;

        // Floor to 0, Cap at 10000 (100.00 max score)
        if (newScoreInt > 10000) {
            newScoreInt = 10000;
        } else if (newScoreInt < 0) {
            newScoreInt = 0;
        }

        uint256 newScore = uint256(newScoreInt);
        agentScores[agentId] = newScore;

        emit AgentRated(msg.sender, agentId, rating, newScore);
    }

    /**
     * @notice Computes and emits a reputation attestation for a specific agent.
     * @param agentId The Virtuals Protocol Agent ID
     * @param vtx Transaction Volume
     * @param aAge Network Age in epochs
     * @param mFlag Number of anomaly flags
     * @param ipfsHash The IPFS CID containing the evaluation record
     * @param signature Cryptographic signature from the trusted backend
     */
    function computeAndEmitAttestation(
        string memory agentId, 
        uint256 vtx, 
        uint256 aAge, 
        uint256 mFlag, 
        string memory ipfsHash,
        bytes memory signature
    ) external {
        // 1 & 2. Verify Signature & Nonce (Block scoped to free stack memory)
        {
            uint256 nonce = agentNonces[agentId];
            bytes32 messageHash = keccak256(abi.encodePacked(agentId, vtx, aAge, mFlag, nonce));
            bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
            
            require(recoverSigner(ethSignedMessageHash, signature) == trustedSigner, "Invalid backend signature");
            agentNonces[agentId] = nonce + 1;
        }

        // 3. Mathematical Reputation Update
        uint256 currentScore = agentScores[agentId];
        if (currentScore == 0) {
            currentScore = 8500;
        }
        
        // Inline math calculation to prevent EVM "Stack too deep"
        int256 delta = int256(29 * (vtx > 0 ? log2(vtx) : 0)) 
                     + int256((31 * aAge) / 100) 
                     - int256(27 * mFlag);
                     
        delta = delta / 10;

        int256 newScoreInt = int256(currentScore) + delta;

        if (newScoreInt > 10000) {
            newScoreInt = 10000;
        } else if (newScoreInt < 0) {
            newScoreInt = 0;
        }

        agentScores[agentId] = uint256(newScoreInt);

        emit AttestationEmitted(msg.sender, agentId, vtx, aAge, mFlag, uint256(newScoreInt), ipfsHash, block.timestamp);
    }
}
