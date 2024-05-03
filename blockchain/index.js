const Block = require("./block");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const mongoose = require("mongoose");
var block = require("../models/block.js");


/*
    blockchain/index.js file: Create Blockchain class.

    Functions: addblock, replaceChain & isValidChain.
    Blockchain creates multiple blocks together in chain array.
*/
class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }
    // every block last hash is set the hash of previous block 
    addBlock({data}){
        const newBlock = Block.mineBlock({
                lastBlock: this.chain[this.chain.length-1],
                data
            });
            console.log('pushin!');

        this.chain.push(newBlock);
        

    }
    replaceChain(chain, validateTransactions, onSuccess){
        if (chain.length <= this.chain.length){
            console.error("The incoming chain must be longer");
            return;
        }

        if (!Blockchain.isValidChain(chain)){
            console.error("The incoming chain is invalid");
            return;
        }

        if(validateTransactions && !this.validTransactionData({chain})){
            console.error("The incoming chain has invalid transaction data");
            return
        }
        if(onSuccess) onSuccess();
        console.log("replacing chain with" + chain);

        this.chain = chain;
    }
    
    //not static method to validate the input balance based on the blockchain history
    validTransactionData({chain}){
        for(let i=1; i<chain.length;i++){
            const block =chain[i];
            
            // Set data structure for a collection of unique items,
            // unlike array that allows duplicate
            // instantiate for every single block
            const transactionSet = new Set();
            let rewardTransactionCount = 0;
            
            for(let transaction of block.data){
               
                console.log(transaction.input.address);
                console.log(REWARD_INPUT.address);
                if(transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount +=1;

                    if(rewardTransactionCount>1 ){
                        console.error("Miner rewards exceed limit");
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error("Miner rewards amount is invalid");
                        return false;
                    }
                }
                else{
                    if(!Transaction.validTransaction(transaction)){
                        console.error("Invalid Transaction");
                        return false;
                    }
                    //validating against currrently accepted blockchain
                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if(transaction.input.amount !== trueBalance){
                        console.error("Invalid input amount");
                         return false;
                    }
                    if(transactionSet.has(transaction)){
                        console.error("An identical transaction appears more than once in the block")
                        return false;
                    } else {
                        transactionSet.add(transaction);
                        
                    }
                }
            }
        }


        return true;
    }
    // involving 2 checks: the last hash and the valitatedHash
    static isValidChain(chain){
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        };

        for (let i=1; i< chain.length;i++)
        {
            const {timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty =chain[i-1].difficulty;


            if (lastHash !== actualLastHash) return false;
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if (hash !== validatedHash) return false;

            if(Math.abs(lastDifficulty - difficulty)> 1) return false;
        }
            
        return true;
    }

}

module.exports = Blockchain;