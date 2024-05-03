

const hexToBinary = require("hex-to-binary");
const  mongoose = require("mongoose");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util");

/*
    block.js file: Create Block class.
    
    Building block of the entire blockchain
*/

class Block{
    // Each block has initial sturucture timestamp, lastHash, hash, data, data nonce & difficulty.
    // Data nonce and diffulculty is used for proof-of-work system. 
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    // Initial dummy block of blockchain
    static genesis(){
        
        return new this(GENESIS_DATA);
    }
    static mineBlock({lastBlock, data}){
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        //    Difficulty is determined by the number of "0" for hash
        let  {difficulty}= lastBlock;
        let nonce = 0;
        
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock, timestamp});
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        }while (hexToBinary(hash).substring(0,difficulty) !== "0".repeat(difficulty));

        return new this({ timestamp,lastHash,data,difficulty,nonce,hash });
    }
    // adjusting diffuculty of the block
    static adjustDifficulty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;

        if (difficulty < 1){
            return 1;
        }

        if ((timestamp - originalBlock.timestamp)> MINE_RATE){
            return difficulty - 1;
        }
        return difficulty + 1;
    }
}


/* Node.js sharing code syntax between files */

module.exports = Block;

