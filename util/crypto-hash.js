const crypto = require("crypto");

/*
    crypto-hash.js file
    
    Create cryptohash of SHA-256 in hexadecimal
*/

// Javascript spread operator for n elements, sort and create unique hash based on input arrays
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash("sha256");
    hash.update(inputs.map (input => JSON.stringify(input)).sort().join(" "));
    return hash.digest("hex");
};

module.exports = cryptoHash;