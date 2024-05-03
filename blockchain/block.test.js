const hexToBinary = require("hex-to-binary");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util");

/*
    block.test.js file: TTD Style for Block class.

    Test suite containing 13 -> 18 tests.
*/
describe("Block", () => {
    const timestamp = 2000;
    const lastHash = "foo-lastHash";
    const hash = "foo-Hash";
    const data = ["blockchain", "data"];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty});

    it("has a timestamp, lastHash, hash, data, nonce and difficulty property",()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });
    /*
    1.3
        Creating test for genesis block 
        static function used genesis() for creating/cloning object as caches
    */
    describe("genesis()", () => {
        const genesisBlock = Block.genesis();
        it("return a Block instance", ()=> {
            expect(genesisBlock instanceof Block).toBe(true);
        })
        it("returns the genesis data",() => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    })
    describe("mineBlock()",()=>{
        const lastBlock = Block.genesis();
        const data = "mined data";
        const minedBlock = Block.mineBlock({lastBlock, data});

        it ("returns a Block instance", ()=> {
            expect(minedBlock instanceof Block).toBe(true);
        });
        it ("sets the lastHash to be hash of the lastBlock", ()=> {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it ("sets the data", ()=> {
            expect(minedBlock.data).toEqual(data);
        });
        it ("sets the timestamp", ()=> {
            expect(minedBlock.data).not.toEqual(undefined);
        });

        it("creates a SHA-256", () => {
            expect(minedBlock.hash)
            .toEqual(
                cryptoHash(minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    lastBlock.hash, 
                    data));
        })

        it("sets a hash that meets the difficulty criteria", () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
            .toEqual('0'.repeat(minedBlock.difficulty));
        });

        it("adjust the difficulty", () => {
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        })
    });

    describe("adjustDiffuculty()", () =>{
        it("raises the difficulty for a fast mined block", () =>{
            expect(Block.adjustDifficulty({
                originalBlock: block, 
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1);
        })
        it("lowers the difficulty for a slow mined block", () =>{
            expect(Block.adjustDifficulty({
                originalBlock: block, 
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty-1);
        })
        it("has a lower limit of 1",()=>{
            block.difficulty = -1;

            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        })
    })
    
});