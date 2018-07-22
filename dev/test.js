const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();  // create Chain


const previousBlockHAsh = 'CAADFA8798ADAFA987969';
const currentBlockData = [
  { amount: 10, sender: "S3ND3R", recipient: "R3C1P13N7" },
  { amount: 10, sender: "TWOS3ND3R", recipient: "TWOR3C1P13N7" },
  { amount: 10, sender: "THREES3ND3R", recipient: "THREER3C1P13N7" }
];

// let's find which nonce value return a has starting with '0000'
let nonce = bitcoin.proofOfWork(previousBlockHAsh, currentBlockData);

// running the hash with the right nonce, we can verify that the proof of work got us a hash '0000'
// BLOCK IS VALID!  difficult to get the right proofOfWork, but easy to check validity.
console.log(bitcoin.hashBlock(previousBlockHAsh, currentBlockData, nonce));
console.log(bitcoin);