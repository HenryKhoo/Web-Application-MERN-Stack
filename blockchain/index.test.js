const Blockchain = require("./index");
const Block = require("./block");
const { cryptoHash } = require("../util");
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction")
/*
    index.test.js file: TTD Style for Blockchain class.

    Test suite containing 14 -> 26 tests.
*/
describe("Blockchain", () => {
    let blockchain, newChain, originalChain,errorMock;

    beforeEach(() =>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        errorMock = jest.fn();
        global.console.error = errorMock;

        originalChain = blockchain.chain;
        
    })
    it("contains a `chain` Array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });
    it("adds a new block to the chain", ()=> {
        const newData = "some data";
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe("isValidChain()", () =>{
        describe("when the chain does not start with genesis block", () => {
            it("return false", () =>{
                blockchain.chain[0] ={data:"false-genesis-data"};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

            });
        });

        describe("when the chains starts with the genesis block and has multiple blocks", () => {
            beforeEach(() =>{
                blockchain.addBlock({data: "Bears"});
                blockchain.addBlock({data: "Cats"});
                blockchain.addBlock({data: "Dogs"});
        });            
        describe("and a lastHash reference has changed", () => {
            it("return false", () =>{
                blockchain.chain[2].lastHash = "false-lastHash";

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
              });
            });

            describe("and the chain contains a block with invalid field", () => {
                it("return false", () =>{
                    blockchain.chain[2].data = "false-data";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe("and the chain contains a block with a jumped difficulty",()=>{
                it("return false", () =>{
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];

                    const lastHash =lastBlock.hash;
                    const timestamp = Date.now()
                    const nonce = 0;
                    const data= [];
                    const difficulty = lastBlock.difficulty-3;

                    const hash = cryptoHash(timestamp, lastHash,difficulty, nonce,data);

                    const badBlock = new Block({
                        timestamp,lastHash,hash,nonce,difficulty,data
                    });
                    blockchain.chain.push(badBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            })
            describe("and the chain does not contain any invalid blocks ", () => {
                it("return true",() =>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
    describe("replaceChain()", () =>  {
        let logMock;

        beforeEach(() =>{

            logMock = jest.fn();
            global.console.log = logMock;
        })
        describe("when the new chain is not longer", () => {
            beforeEach(()=> {
                newChain.chain[0] = {new: "chain"};

                blockchain.replaceChain(newChain.chain);
            })
            it("does not replace the chain", () => {
                expect(blockchain.chain).toEqual(originalChain);
            });
            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled();
            })
        });
        describe("when the new chain is longer", () => {
            beforeEach(()=>{
                newChain.addBlock({data: "Bears"});
                newChain.addBlock({data: "Cats"});
            })
            describe("and the chain is invalid", () => {
                beforeEach(()=>{
                    newChain.chain[2].hash = "false-hash";
                    blockchain.replaceChain(newChain.chain);
                })
                it("does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled();
                })
            });
            describe("and the chain is valid", () => {
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                })
                it("replaces the chain", () => {
                    expect(blockchain.chain).toEqual(newChain.chain);

                });
                it("logs about chain replacement", () => {
                    expect(logMock).toHaveBeenCalled();
                })
            });
        });

        describe("and the validateTransactions flag is true", ()=>{
            it("calls validTransactionData()",()=>{
                const validateTransactionMock = jest.fn();

                blockchain.validTransactionData = validateTransactionMock;

                newChain.addBlock({data: "foo"})
                blockchain.replaceChain(newChain.chain, true);
                
                expect(validateTransactionMock).toHaveBeenCalled();
            })
        })
    });

    describe("validTransactionData()", ()=>{
        let transaction, rewardTransaction, wallet;

        beforeEach(()=>{
            wallet = new Wallet();
            transaction = wallet.createTransaction({recipient: "foo-data", amount: 65});
            rewardTransaction = Transaction.rewardTransaction({minerWallet: wallet});
        });
        describe("and the transaction data is valid", ()=>{
            it("returns true", ()=>{
                newChain.addBlock({
                    data: [transaction, rewardTransaction]
                });

                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(true);
                expect(errorMock).not.toHaveBeenCalled();
            });
        })
        // 4 rules when the transaction is invalid: 
        // 1. multiple rewards, 2. has one malformed outputMap
        // 3. the transaction is reward transaction
        // 4. transaction is malformed input
        describe("and the transaction data has multiple rewards", ()=>{
            it("returns false and logs an error", ()=>{
                newChain.addBlock({data:[transaction, rewardTransaction, rewardTransaction]})
                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);

            });
        });
        describe("and the transaction data has at least one malformed outputMap", ()=>{
            describe("and the transaction is not a reward transaction", ()=>{
                it("returns false and logs an error", ()=>{
                transaction.outputMap[wallet.publicKey] = 999999;
                newChain.addBlock({data: [transaction, rewardTransaction]});
                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
                expect(errorMock).toHaveBeenCalled();
                });
            });
            describe("and the transaction is a reward transaction", ()=>{
                it("returns false and logs an error", ()=>{
                rewardTransaction.outputMap[wallet.publicKey] = 999999;
                newChain.addBlock({data: [transaction, rewardTransaction]});
                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
                expect(errorMock).toHaveBeenCalled();
                });
            });
        });
        describe("and the transaction data has at least one malformed input", ()=>{
            it("returns false and logs an error", ()=>{
                wallet.balance = 9000;
                const evilOutputMap = {
                    [wallet.publicKey]:8900,
                    fooRecipient:100
                };

                const evilTransaction = {
                    input:{
                        timestamp: Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(evilOutputMap)
                    },
                    outputMap: evilOutputMap
                };
                newChain.addBlock({data: [evilTransaction,rewardTransaction]})
                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });
        describe("and the block contains multiple identical transactions", ()=>{
            it("returns false and logs an error", ()=>{

                newChain.addBlock({
                    data: [transaction, transaction, transaction, rewardTransaction]
                });
                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });
    })
});
