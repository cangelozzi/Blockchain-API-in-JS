//TODO Blockchain function constructor, (better than Class :)

// class Blockchain {
//   constructor() {
//     this.chain = [];
//     this.newTransaction = [];
//   }
// }

const sha256 = require("sha256");

function Blockchain() {
  this.chain = []; // blocks will be stored in this array
  this.pendingTransaction = []; // transactions waiting to be mined

  // GENESIS BLOCK
  this.createNewBlock(100, '0', '0');  // GENESIS BLOCK without Proof of Work, with a ARBITRARY PARAMETERS.
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  // create a new Block in the chain, const since block cannot be changed
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransaction,
    nonce: nonce, //! nonce is a proof that we are creating a block legitimate with a Proof of Work
    hash: hash, //! hash is data from new transaction, which will be compressed to a hash
    previousBlockHash: previousBlockHash //! hash/data from the previous block
  };

  this.pendingTransaction = []; // clear the transactions array, ready for next block to be created.
  this.chain.push(newBlock); // push new block to chain

  return newBlock;
};

// method to return LAST BLOCK
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

// method for creating new TRANSACTION
Blockchain.prototype.createNewTransaction = function(
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient
  };

  this.pendingTransaction.push(newTransaction); // push transaction to chain transaction array, waiting to be recorded as Block via mining, previous validation

  return this.getLastBlock()["index"] + 1;
};

// method to get a block and hash it to a "fixed length random" string ie. 'DA434DAAF69'
Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce
) {
  // turn ALL the data (functions arguments) into ONE STRING
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

  // create a hash of the above string
  const hash = sha256(dataAsString);

  return hash;
};

// PROOF OF WORK method, making sure block added to the chain is legitimate
// => repeatedly hash block until it finds the correct hash (start with '0000' )
// => use currentData and previousHash
// => continously changes nonce value (+1) until it finds the correct hash with '0000' at the beginning of the hash
// => return to us the nonce value that create the corect hash
Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  // run untill we get '0000' at beginning...increasing nonce by 1
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    // console.log(hash); 
  }

  // return the nonce value that give the hash with a beginning '0000'
  // NB => previousBlockHash, currentBlockData would return always the same hash, what makes the hash different is the nonce!
  return nonce;
};

module.exports = Blockchain;
