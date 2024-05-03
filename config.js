/*
    config.js file: Initialize the genesis block.

*/

// 1000 milliseconds as 1 second
const MINE_RATE = 1000; 
const INITIAL_DIFFICULTY = 3;


// Genesis block for first transaction
const GENESIS_DATA  =
{
    timestamp: 1,
    lastHash: "----",
    hash: "hash-1",
    difficulty: INITIAL_DIFFICULTY,
    nonce:0,
    data:[]
}

const STARTING_BALANCE = 1000;

// Reward for mining transactions
const REWARD_INPUT = {address :"*authorized-reward*"};

const MINING_REWARD = 50;

module.exports = {
    GENESIS_DATA, 
    MINE_RATE, 
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};